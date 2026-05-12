import mongoose, { Schema, models, model } from "mongoose";

const ConsultationFormSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    age: String,
    location: String,
    ethnicity: String,
    fitzpatrickType: String,

    mainConcern: {
      type: String,
      required: true,
    },

    concernDuration: String,
    sunWorsens: String,

    triggers: [String],
    medicalHistory: String,

    morningRoutine: String,
    eveningRoutine: String,
    previousTreatments: String,

    skinPhotos: [String],
    productPhotos: [String],

    goals: {
      type: String,
      required: true,
    },

    budget: String,
    language: String,
    extraNotes: String,

    status: {
      type: String,
      enum: ["submitted", "reviewed", "booked", "completed"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

const ConsultationForm =
  models.ConsultationForm ||
  model("ConsultationForm", ConsultationFormSchema);

export default ConsultationForm;