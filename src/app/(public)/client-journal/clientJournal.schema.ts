import { z } from "zod";

export const clientJournalSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),

  age: z.string(),
  location: z.string(),
  ethnicity: z.string(),
  fitzpatrickType: z.string(),

  mainConcern: z
    .string()
    .min(10, "Please describe your main skin concern in at least 10 characters."),

  concernDuration: z.string(),
  sunWorsens: z.string(),

  triggers: z.array(z.string()),

  medicalHistory: z.string(),
  morningRoutine: z.string(),
  eveningRoutine: z.string(),
  previousTreatments: z.string(),

  goals: z
    .string()
    .min(10, "Please describe what you want to achieve in at least 10 characters."),

  budget: z.string(),
  language: z.string().min(1, "Please choose your preferred consultation language."),
  extraNotes: z.string(),
});

export type ClientJournalFormData = z.infer<typeof clientJournalSchema>;

export const clientJournalDefaultValues: ClientJournalFormData = {
  fullName: "",
  email: "",
  age: "",
  location: "",
  ethnicity: "",
  fitzpatrickType: "Unknown / Not sure",
  mainConcern: "",
  concernDuration: "",
  sunWorsens: "",
  triggers: [],
  medicalHistory: "",
  morningRoutine: "",
  eveningRoutine: "",
  previousTreatments: "",
  goals: "",
  budget: "",
  language: "English",
  extraNotes: "",
};