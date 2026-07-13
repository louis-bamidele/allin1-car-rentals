import mongoose from "mongoose";
import { connectDB } from "../_lib/db.js";
import { verifyAuth } from "../_lib/auth.js";
import Category from "../_lib/models/Category.js";
import Car from "../_lib/models/Car.js";

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  // PATCH /api/categories/:id — rename / re-translate / re-order
  if (req.method === "PATCH") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    try {
      const cat = await Category.findById(id);
      if (!cat) return res.status(404).json({ message: "Category not found" });

      const { name, translations, order } = req.body || {};

      // If the name is being changed, cascade-update every car that
      // references the old name so nothing is left orphaned.
      if (name && name.trim() && name.trim() !== cat.name) {
        const newName = name.trim();
        const newSlug = slugify(newName);
        const dup = await Category.findOne({ _id: { $ne: id }, $or: [{ slug: newSlug }, { name: newName }] });
        if (dup) {
          return res.status(400).json({ message: "A category with this name already exists" });
        }
        const oldName = cat.name;
        cat.name = newName;
        cat.slug = newSlug;
        await cat.save();
        await Car.updateMany({ category: oldName }, { $set: { category: newName } });
      }

      if (translations) {
        cat.translations = {
          es: (translations.es ?? cat.translations?.es ?? "").trim(),
          nl: (translations.nl ?? cat.translations?.nl ?? "").trim(),
        };
      }
      if (typeof order === "number") cat.order = order;
      await cat.save();
      return res.json(cat);
    } catch (err) {
      console.error("PATCH /api/categories/:id error:", err);
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  // DELETE /api/categories/:id — blocked if any cars use it
  if (req.method === "DELETE") {
    const user = await verifyAuth(req, res);
    if (!user) return;

    try {
      const cat = await Category.findById(id);
      if (!cat) return res.status(404).json({ message: "Category not found" });

      const carsInUse = await Car.countDocuments({ category: cat.name });
      if (carsInUse > 0) {
        return res.status(400).json({
          message: `${carsInUse} car${carsInUse === 1 ? "" : "s"} still in this category. Reassign or delete them first.`,
          carsInUse,
        });
      }

      await Category.findByIdAndDelete(id);
      return res.json({ message: "Category deleted" });
    } catch (err) {
      console.error("DELETE /api/categories/:id error:", err);
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
