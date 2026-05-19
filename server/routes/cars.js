const router = require("express").Router();
const Car = require("../models/Car");
const protect = require("../middleware/protect");
const upload = require("../config/cloudinary");

const photoFields = upload.fields([
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
]);

// GET all cars — public (exclude long fields from list)
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find()
      .select("-longDescription -features -highlights -gallery")
      .sort({ createdAt: 1 });
    res.json(cars);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single car by slug — public
router.get("/:slug", async (req, res) => {
  try {
    const car = await Car.findOne({ slug: req.params.slug });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add car — protected
router.post("/", protect, photoFields, async (req, res) => {
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

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const existing = await Car.findOne({ slug });
    if (existing)
      return res.status(400).json({ message: "A car with this name already exists" });

    const car = await Car.create({
      slug,
      name,
      category,
      seats: Number(seats),
      doors: Number(doors),
      transmission,
      fuel,
      consumption,
      bags: Number(bags),
      dailyRate: Number(dailyRate),
      weeklyRate: Number(weeklyRate),
      monthlyRate: Number(monthlyRate),
      year: Number(year),
      color,
      image: photos[0],
      gallery: photos,
      description,
      longDescription,
      features,
      highlights,
    });

    res.status(201).json(car);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PUT update car — protected (photos are optional; send photo{n}_url to keep existing)
router.put("/:id", protect, photoFields, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
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
      req.params.id,
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

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// DELETE car — protected
router.delete("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
