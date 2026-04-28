import mongoose, { Schema, Document } from "mongoose";

export type Settings = Document & {
  adminId: mongoose.Types.ObjectId;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicAbout: string;
  logoUrl: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  updatedAt: Date;
};

const SettingsSchema = new Schema<Settings>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    clinicName: { type: String, default: "Brook Skincare" },
    clinicAddress: { type: String, default: "" },
    clinicPhone: { type: String, default: "" },
    clinicAbout: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model<Settings>("Settings", SettingsSchema);