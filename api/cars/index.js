import { connectDB } from "../_lib/db.js";
import { upload, runMiddleware, uploadToCloudinary } from "../_lib/upload.js";
import { verifyAuth } from "../_lib/auth.js";
import Car from "../_lib/models/Car.js";

// Disable Vercel's body parser so multer can read the multipart stream
export const config = { api: { bodyParser: false } };
// Allow up to 60 s for the whole request — Cloudinary uploads can take a moment
// (Vercel Hobby cap is 10 s; Pro default 60 s; Pro+config up to 300 s)
export const maxDuration = 60;

const photoFields = upload.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
]);

export default async function handler(req, res) {
  await connectDB();

  // GET /api/cars        — public, only available cars
  // GET /api/cars?all=1  — admin only, returns all cars including unavailable
  if (req.method === "GET") {
    try {
      const showAll = req.query.all === "1";
      if (showAll) {
        const user = await verifyAuth(req, res);
        if (!user) return;
      }
      const filter = showAll ? {} : { available: { $ne: false } };
      const cars = await Car.find(filter)
        .select("-longDescription -features -highlights -gallery")
        .sort({ createdAt: 1 });
      return res.json(cars);
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // POST /api/cars — protected, multipart
  if (req.method === "POST") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    const t0 = Date.now();
    try {
      await runMiddleware(req, res, photoFields);
    } catch (err) {
      return res.status(400).json({ message: `Photo upload failed: ${err.message}` });
    }
    console.log(`[POST /api/cars] multer parsed body in ${Date.now() - t0}ms`);

    try {
      const {
        name, category,
        seats, doors, transmission, fuel, consumption,
        bags, dailyRate, weeklyRate, monthlyRate, year, color,
        description, longDescription,
      } = req.body;

      if (!name) return res.status(400).json({ message: "Car name is required" });
      if (!dailyRate) return res.status(400).json({ message: "Daily rate is required" });

      const features   = (JSON.parse(req.body.features   || "[]")).filter((f) => f.trim());
      const highlights = (JSON.parse(req.body.highlights || "[]")).filter((h) => h.trim());

      const fileEntries = ["photo1", "photo2", "photo3", "photo4"].map(
        (k) => req.files?.[k]?.[0]
      );
      if (fileEntries.some((f) => !f))
        return res.status(400).json({ message: "All 4 photos are required" });

      const totalBytes = fileEntries.reduce((sum, f) => sum + f.size, 0);
      console.log(`[POST /api/cars] uploading 4 photos, ${(totalBytes / 1024).toFixed(0)} KB total`);
      const tUpload = Date.now();
      const photos = await Promise.all(
        fileEntries.map((f) => uploadToCloudinary(f.buffer))
      );
      console.log(`[POST /api/cars] Cloudinary upload finished in ${Date.now() - tUpload}ms`);

      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const existing = await Car.findOne({ slug });
      if (existing)
        return res.status(400).json({ message: "A car with this name already exists" });

      const car = await Car.create({
        slug, name,
        category: category || "Economy",
        seats:       seats       ? Number(seats)       : undefined,
        doors:       doors       ? Number(doors)       : undefined,
        transmission: transmission || undefined,
        fuel:         fuel         || undefined,
        consumption:  consumption  || "",
        bags:         bags         ? Number(bags)       : undefined,
        dailyRate:    Number(dailyRate),
        weeklyRate:   weeklyRate   ? Number(weeklyRate)  : 0,
        monthlyRate:  monthlyRate  ? Number(monthlyRate) : 0,
        year:         year         || undefined,
        color:        color        || "",
        image:        photos[0],
        gallery:      photos,
        description:        description        || "",
        longDescription:    longDescription    || "",
        features,
        highlights,
      });

      return res.status(201).json(car);
    } catch (err) {
      console.error("POST /api/cars error:", err);

      if (err.name === "ValidationError") {
        const fieldErrors = {};
        for (const [field, e] of Object.entries(err.errors)) {
          const uiField = field === "slug" ? "name" : field;
          fieldErrors[uiField] = e.message;
        }
        return res.status(400).json({
          message: `Please fix the following field(s): ${Object.keys(fieldErrors).join(", ")}`,
          fieldErrors,
        });
      }

      if (err.code === 11000) {
        const dupField = Object.keys(err.keyValue || {})[0] || "field";
        const uiField = dupField === "slug" ? "name" : dupField;
        const fieldErrors = { [uiField]: `A car with this ${uiField} already exists.` };
        return res.status(400).json({
          message: fieldErrors[uiField],
          fieldErrors,
        });
      }

      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
