import mongoose from "mongoose";

// Categories are admin-managed. Cars reference them by `name` (canonical).
// Optional `translations` map holds per-language display overrides.
const categorySchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, unique: true, trim: true },
    slug:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    order: { type: Number, default: 0 },
    translations: {
      es: { type: String, default: "" },
      nl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Guard against OverwriteModelError in warm serverless instances
export default mongoose.models.Category || mongoose.model("Category", categorySchema);
