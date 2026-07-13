import { connectDB } from "../_lib/db.js";
import { verifyAuth } from "../_lib/auth.js";
import Category from "../_lib/models/Category.js";
import Car from "../_lib/models/Car.js";

// Seed the three existing categories on first-ever call so the site
// keeps working even if the DB was never touched by an admin.
async function seedIfEmpty() {
  const count = await Category.estimatedDocumentCount();
  if (count > 0) return;
  await Category.insertMany([
    { name: "Economy",  slug: "economy",  order: 0, translations: { es: "Económico", nl: "Economy" } },
    { name: "Comfort",  slug: "comfort",  order: 1, translations: { es: "Confort",   nl: "Comfort" } },
    { name: "SUV",      slug: "suv",      order: 2, translations: { es: "SUV",       nl: "SUV" } },
  ]);
  console.log("[categories] seeded 3 default categories");
}

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function handler(req, res) {
  await connectDB();
  await seedIfEmpty();

  // GET /api/categories — public, ordered
  if (req.method === "GET") {
    try {
      const cats = await Category.find({}).sort({ order: 1, name: 1 });
      return res.json(cats);
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // POST /api/categories — admin
  if (req.method === "POST") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    try {
      const { name, translations = {} } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Category name is required" });
      }
      const slug = slugify(name);
      const existing = await Category.findOne({ $or: [{ slug }, { name: name.trim() }] });
      if (existing) {
        return res.status(400).json({ message: "A category with this name already exists" });
      }
      const maxOrder = await Category.findOne({}).sort({ order: -1 }).select("order");
      const cat = await Category.create({
        name: name.trim(),
        slug,
        order: (maxOrder?.order ?? -1) + 1,
        translations: {
          es: (translations.es || "").trim(),
          nl: (translations.nl || "").trim(),
        },
      });
      return res.status(201).json(cat);
    } catch (err) {
      console.error("POST /api/categories error:", err);
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
