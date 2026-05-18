import { connectDB } from "../../_lib/db.js";
import { verifyAuth } from "../../_lib/auth.js";
import Car from "../../_lib/models/Car.js";

// Body parser ON (default) — we receive plain JSON, no multipart
export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const user = await verifyAuth(req, res);
  if (!user) return;

  try {
    const { id } = req.query;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({ message: "available must be a boolean" });
    }

    const car = await Car.findByIdAndUpdate(
      id,
      { available },
      { new: true, runValidators: false }
    );

    if (!car) return res.status(404).json({ message: "Car not found" });

    return res.json({ _id: car._id, available: car.available });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
