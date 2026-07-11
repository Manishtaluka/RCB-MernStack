import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: { type: [String], default: [] }, // e.g. ["match-report", "transfer-news"]
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", content: "text" });

export default mongoose.model("Post", postSchema);
