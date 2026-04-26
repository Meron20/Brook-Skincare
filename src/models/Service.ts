import mongoose, { Schema, Document } from "mongoose";

export type Service = Document & {
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
};

const ServiceSchema = new Schema<Service>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model<Service>("Service", ServiceSchema);