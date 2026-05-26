import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage — files land in req.files[name][0].buffer, never touch disk
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Push a single file buffer directly to Cloudinary and return the secure URL.
// Has its own 45 s timeout so a stalled Cloudinary connection can't hang the
// whole serverless function until Vercel kills it.
export function uploadToCloudinary(buffer, perFileTimeoutMs = 45_000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const settleReject = (err) => { if (!settled) { settled = true; reject(err); } };
    const settleResolve = (val) => { if (!settled) { settled = true; resolve(val); } };

    const timer = setTimeout(() => {
      settleReject(new Error("Cloudinary upload timed out after 45 s"));
    }, perFileTimeoutMs);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "allin1-car-rentals",
        resource_type: "image",
        timeout: perFileTimeoutMs,
        transformation: [
          { width: 1200, height: 750, crop: "fill", quality: 85, fetch_format: "auto" },
        ],
      },
      (error, result) => {
        clearTimeout(timer);
        if (error) settleReject(error);
        else if (!result?.secure_url) settleReject(new Error("Cloudinary returned no URL"));
        else settleResolve(result.secure_url);
      }
    );
    stream.on("error", (err) => { clearTimeout(timer); settleReject(err); });
    stream.end(buffer);
  });
}

// Runs Express-style middleware inside a Vercel serverless handler
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
