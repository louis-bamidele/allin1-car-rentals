import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "allin1-car-rentals",
    // No allowed_formats restriction — accept any image format (HEIC, AVIF, etc.)
    // and let Cloudinary auto-convert. The transformation below normalises output.
    resource_type: "image",
    transformation: [{ width: 1200, height: 750, crop: "fill", quality: 85, fetch_format: "auto" }],
  },
});

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Runs Express-style middleware inside a Vercel serverless handler
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
