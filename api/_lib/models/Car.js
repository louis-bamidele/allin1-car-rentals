import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:           { type: String, required: true, trim: true },
    category:       { type: String, required: true, enum: ["Economy", "Comfort", "SUV"] },
    seats:          { type: Number, default: 5 },
    doors:          { type: Number, default: 4 },
    transmission:   { type: String, default: "Automatic" },
    fuel:           { type: String, default: "Petrol" },
    consumption:    { type: String, default: "" },
    bags:           { type: Number, default: 2 },
    dailyRate:      { type: Number, required: true },
    weeklyRate:     { type: Number, default: 0 },
    monthlyRate:    { type: Number, default: 0 },
    year:           { type: Number, default: () => new Date().getFullYear() },
    color:          { type: String, default: "" },
    image:          { type: String, required: true },
    gallery:        { type: [String], required: true },
    description:    { type: String, default: "" },
    longDescription:{ type: String, default: "" },
    features:       { type: [String], default: [] },
    highlights:     { type: [String], default: [] },
    available:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Guard against OverwriteModelError in warm serverless instances
export default mongoose.models.Car || mongoose.model("Car", carSchema);
