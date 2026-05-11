import mongoose, { Schema, Document } from "mongoose";

export type FAQ = Document & {
  question: string;
  answer: string;
  category: string;
  order: number;
  isVisible: boolean;
};

const FAQSchema = new Schema<FAQ>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "general",
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FAQ ||
  mongoose.model<FAQ>("FAQ", FAQSchema);