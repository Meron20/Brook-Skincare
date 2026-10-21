import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const ConsultationFormSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    /*
     * Determines which questionnaire was submitted.
     *
     * standard = current Client Journal form
     * melasma  = Amharic Melasma assessment
     */
    formType: {
      type: String,
      enum: ["standard", "melasma", "general"],
      default: "standard",
    },

    /*
     * Additional answers that belong specifically
     * to the Melasma assessment.
     *
     * Mixed lets us add the Amharic questionnaire
     * fields without breaking the existing standard form.
     */
    melasmaAssessment: {
      type: Schema.Types.Mixed,
      default: null,
    },

    generalAssessment: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    
    status: {
      type: String,
      enum: [
        "submitted",
        "reviewed",
        "booked",
        "completed",
      ],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

const ConsultationForm =
  models.ConsultationForm ||
  model(
    "ConsultationForm",
    ConsultationFormSchema
  );

export default ConsultationForm;