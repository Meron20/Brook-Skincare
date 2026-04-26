import mongoose, { Schema, Document } from "mongoose";

export type TimeSlot = Document & {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
  createdAt: Date;
};

const TimeSlotSchema = new Schema<TimeSlot>(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TimeSlot ||
  mongoose.model<TimeSlot>("TimeSlot", TimeSlotSchema);