import mongoose from "mongoose";
import { connectDB } from "../_lib/db.js";
import { upload, runMiddleware, uploadToCloudinary } from "../_lib/upload.js";
import { verifyAuth } from "../_lib/auth.js";
import Car from "../_lib/models/Car.js";

// Disable Vercel's body parser so multer can read the multipart stream
export const config = { api: { bodyParser: false } };
// Allow up to 60 s for the whole request — Cloudinary uploads can take a moment
export const maxDuration = 60;

const photoFields = upload.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
]);

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  // GET /api/cars/:id — find by MongoDB _id OR slug, public
  // Admins fetching the full record for the edit form pass _id; the public
  // car detail page passes slug. We try _id first if the value looks like
  // a valid ObjectId, then fall back to slug.
  if (req.method === "GET") {
    try {
      let car = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        car = await Car.findById(id);
      }
      if (!car) {
        car = await Car.findOne({ slug: id });
      }
      if (!car) return res.status(404).json({ message: "Car not found" });
      return res.json(car);
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // PUT /api/cars/:id — update by MongoDB _id, protected, multipart
  if (req.method === "PUT") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    try {
      await runMiddleware(req, res, photoFields);
    } catch (err) {
      return res.status(400).json({ message: `Photo upload failed: ${err.message}` });
    }

    try {
      const car = await Car.findById(id);
      if (!car) return res.status(404).json({ message: "Car not found" });

      const {
        name, category,
        seats, doors, transmission, fuel, consumption,
        bags, carryOn, dailyRate, weeklyRate, monthlyRate, year, color,
        description, longDescription,
      } = req.body;

      const features   = (JSON.parse(req.body.features   || "[]")).filter((f) => f.trim());
      const highlights = (JSON.parse(req.body.highlights || "[]")).filter((h) => h.trim());

      const newFiles = ["photo1", "photo2", "photo3", "photo4"]
        .map((k) => req.files?.[k]?.[0])
        .filter(Boolean);
      if (newFiles.length > 0) {
        const totalBytes = newFiles.reduce((sum, f) => sum + f.size, 0);
        console.log(`[PUT /api/cars/${id}] re-uploading ${newFiles.length} photo(s), ${(totalBytes / 1024).toFixed(0)} KB total`);
      }
      const tUpload = Date.now();
      const photos = await Promise.all(
        ["photo1", "photo2", "photo3", "photo4"].map(async (k, i) => {
          const file = req.files?.[k]?.[0];
          if (file) return uploadToCloudinary(file.buffer);
          const existing = req.body[`${k}_url`];
          if (existing) return existing;
          return car.gallery[i] || "";
        })
      );
      console.log(`[PUT /api/cars/${id}] photo step finished in ${Date.now() - tUpload}ms`);

      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const updated = await Car.findByIdAndUpdate(
        id,
        {
          slug, name,
          category:     category     || car.category,
          seats:        seats        ? Number(seats)        : car.seats,
          doors:        doors        ? Number(doors)        : car.doors,
          transmission: transmission || car.transmission,
          fuel:         fuel         || car.fuel,
          consumption:  consumption  !== undefined ? consumption : car.consumption,
          bags:         bags         ? Number(bags)         : car.bags,
          carryOn:      carryOn != null && carryOn !== "" ? Number(carryOn) : car.carryOn,
          dailyRate:    Number(dailyRate),
          weeklyRate:   weeklyRate   ? Number(weeklyRate)   : car.weeklyRate,
          monthlyRate:  monthlyRate  ? Number(monthlyRate)  : car.monthlyRate,
          year:         year         || car.year,
          color:        color        !== undefined ? color  : car.color,
          image:        photos[0],
          gallery:      photos,
          description:       description       !== undefined ? description       : car.description,
          longDescription:   longDescription   !== undefined ? longDescription   : car.longDescription,
          features,
          highlights,
        },
        { new: true, runValidators: false }
      );

      return res.json(updated);
    } catch (err) {
      console.error("PUT /api/cars/:id error:", err);

      // Mongoose validation error — map each failing field to its message
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        for (const [field, e] of Object.entries(err.errors)) {
          // slug errors surface in the UI as "name"
          const uiField = field === "slug" ? "name" : field;
          fieldErrors[uiField] = e.message;
        }
        return res.status(400).json({
          message: `Please fix the following field(s): ${Object.keys(fieldErrors).join(", ")}`,
          fieldErrors,
        });
      }

      // MongoDB duplicate-key error (e.g. slug/name already taken)
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

  // DELETE /api/cars/:id — protected
  if (req.method === "DELETE") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    try {
      const car = await Car.findByIdAndDelete(id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      return res.json({ message: "Car deleted successfully" });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
