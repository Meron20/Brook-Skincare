import mongoose, { Schema, models, model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

const ActivityLog =
  models.ActivityLog || model("ActivityLog", ActivityLogSchema);

export default ActivityLog;