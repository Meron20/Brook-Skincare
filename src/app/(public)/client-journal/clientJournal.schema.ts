import { z } from "zod";

const requiredText = z.string().min(1, "እባክዎ ይህንን ጥያቄ ይመልሱ");

export const generalSchema = z.object({
  // Personal information
  fullName: requiredText,
  country: requiredText,
  phone: requiredText,
  email: z.string().optional(),

  // 1. Main skin concern
  mainConcern: requiredText,

  // 2. Products (names, photos come later)
  productNames: z.string().optional(),

  // 3. Allergies
  allergies: requiredText,

  // 4. Skin type
  skinType: requiredText,

  // 5. Daily exposure
  dailyExposure: requiredText,

  // 6. Makeup
  makeupUse: requiredText,

  // 7. Pregnant / breastfeeding
  pregnantOrBreastfeeding: requiredText,
});

export type GeneralFormData = z.infer<typeof generalSchema>;

export const generalDefaultValues: GeneralFormData = {
  fullName: "",
  country: "",
  phone: "",
  email: "",
  mainConcern: "",
  productNames: "",
  allergies: "",
  skinType: "",
  dailyExposure: "",
  makeupUse: "",
  pregnantOrBreastfeeding: "",
};