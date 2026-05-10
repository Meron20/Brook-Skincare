import mongoose, { Schema, Document } from "mongoose";

export type Newsletter = Document & {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
};

const NewsletterSchema = new Schema<Newsletter>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter ||
  mongoose.model<Newsletter>("Newsletter", NewsletterSchema);