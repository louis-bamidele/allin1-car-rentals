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

  // GET /api/cars — public
  if (req.method === "GET") {
    try {
      const cars = await Car.find()
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

    await runMiddleware(req, res, photoFields);

    try {
      const {
        name, category, seats, doors, transmission, fuel, consumption,
        bags, dailyRate, weeklyRate, monthlyRate, year, color,
        description, longDescription,
      } = req.body;

      const features = JSON.parse(req.body.features || "[]");
      const highlights = JSON.parse(req.body.highlights || "[]");

      const photos = ["photo1", "photo2", "photo3", "photo4"].map(
        (k) => req.files?.[k]?.[0]?.path
      );
      if (photos.some((p) => !p))
        return res.status(400).json({ message: "All 4 photos are required" });

      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const existing = await Car.findOne({ slug });
      if (existing)
        return res.status(400).json({ message: "A car with this name already exists" });

      const car = await Car.create({
        slug, name, category,
        seats: Number(seats), doors: Number(doors),
        transmission, fuel, consumption,
        bags: Number(bags),
        dailyRate: Number(dailyRate), weeklyRate: Number(weeklyRate), monthlyRate: Number(monthlyRate),
        year: Number(year), color,
        image: photos[0], gallery: photos,
        description, longDescription, features, highlights,
      });

      return res.status(201).json(car);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
