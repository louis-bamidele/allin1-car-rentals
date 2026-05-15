import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Economy", "Comfort", "SUV"] },
    seats: { type: Number, required: true },
    doors: { type: Number, required: true },
    transmission: { type: String, required: true },
    fuel: { type: String, required: true },
    consumption: { type: String, required: true },
    bags: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    weeklyRate: { type: Number, required: true },
    monthlyRate: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], required: true, validate: (v) => v.length === 4 },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    features: { type: [String], required: true },
    highlights: { type: [String], required: true },
  },
  { timestamps: true }
);

// Guard against OverwriteModelError in warm serverless instances
export default mongoose.models.Car || mongoose.model("Car", carSchema);
