import mongoose, { Schema, Document } from "mongoose";

export type Article = Document & {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "melasma" | "ingredients" | "routines" | "spf" | "general";
  coverImage: string;
  isPublished: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ArticleSchema = new Schema<Article>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      enum: ["melasma", "ingredients", "routines", "spf", "general"],
      default: "general",
    },
    coverImage: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);



export default mongoose.models.Article ||
  mongoose.model<Article>("Article", ArticleSchema);