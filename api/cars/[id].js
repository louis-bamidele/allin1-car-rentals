import { connectDB } from "../_lib/db.js";
import { upload, runMiddleware } from "../_lib/upload.js";
import { verifyAuth } from "../_lib/auth.js";
import Car from "../_lib/models/Car.js";

// Disable Vercel's body parser so multer can read the multipart stream
export const config = { api: { bodyParser: false } };

const photoFields = upload.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
]);

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  // GET /api/cars/:id — find by slug, public
  if (req.method === "GET") {
    try {
      const car = await Car.findOne({ slug: id });
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

    await runMiddleware(req, res, photoFields);

    try {
      const car = await Car.findById(id);
      if (!car) return res.status(404).json({ message: "Car not found" });

      const {
        name, category, seats, doors, transmission, fuel, consumption,
        bags, dailyRate, weeklyRate, monthlyRate, year, color,
        description, longDescription,
      } = req.body;

      const features = JSON.parse(req.body.features || "[]");
      const highlights = JSON.parse(req.body.highlights || "[]");

      const photos = ["photo1", "photo2", "photo3", "photo4"].map((k, i) => {
        const file = req.files?.[k]?.[0];
        if (file) return file.path;
        const existing = req.body[`${k}_url`];
        if (existing) return existing;
        return car.gallery[i];
      });

      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const updated = await Car.findByIdAndUpdate(
        id,
        {
          slug, name, category,
          seats: Number(seats), doors: Number(doors),
          transmission, fuel, consumption,
          bags: Number(bags),
          dailyRate: Number(dailyRate), weeklyRate: Number(weeklyRate), monthlyRate: Number(monthlyRate),
          year: Number(year), color,
          image: photos[0], gallery: photos,
          description, longDescription, features, highlights,
        },
        { new: true, runValidators: true }
      );

      return res.json(updated);
    } catch (err) {
      console.error(err);
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
