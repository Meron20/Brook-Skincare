import mongoose, { Schema, models, model } from "mongoose";

const JournalNoteSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

const JournalNote =
  models.JournalNote || model("JournalNote", JournalNoteSchema);

export default JournalNote;