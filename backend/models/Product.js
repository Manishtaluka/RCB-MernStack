import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["jersey", "cap", "accessories", "merchandise", "collectibles"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    sizes: { type: [String], default: [] }, // e.g. ["S","M","L","XL"] for jerseys
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
