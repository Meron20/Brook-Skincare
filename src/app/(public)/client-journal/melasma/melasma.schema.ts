import { z } from "zod";

const requiredText = z
  .string()
  .min(1, "እባክዎ ይህንን ጥያቄ ይመልሱ");

const requiredMulti = z
  .array(z.string())
  .min(1, "እባክዎ ቢያንስ አንድ ይምረጡ");

export const melasmaSchema = z.object({
  // Personal information
  fullName: requiredText,
  country: requiredText,
  phone: requiredText,
  email: z.string().optional(),

  // 1
  melasmaStarted: requiredText,
  melasmaStartedOther: z.string().optional(),

  // 2
  familyHistory: requiredText,

  // 2.1
  melasmaOnsetFactors: requiredMulti,
  melasmaOnsetFactorsOther: z.string().optional(),

  // 3
  hormonalFactors: requiredMulti,

  // 4
  heatExposure: requiredMulti,
  heatExposureOther: z.string().optional(),

  // 5
  sunscreenFrequency: requiredText,

  // 6
  sunscreenReaction: requiredText,
  sunscreenReactionOther: z.string().optional(),

  // 7
  psychologicalState: requiredText,
  psychologicalStateOther: z.string().optional(),

  // 8
  skinHealing: requiredText,

  // 9
  bleachingHistory: requiredText,
  bleachingHistoryOther: z.string().optional(),

  // 10
  bleachingResult: requiredText,
  bleachingResultOther: z.string().optional(),

  // 11
  worseningFactors: requiredMulti,
  worseningFactorsOther: z.string().optional(),

  // 12
  medicationUse: z.string().optional(),
  medicationDetails: z.string().optional(),

  // 13
  melasmaProducts: requiredMulti,
  melasmaProductsOther: z.string().optional(),

  // 14
  skinType: requiredText,
  skinTypeOther: z.string().optional(),

  // 15
  currentSkinCondition: requiredMulti,
  currentSkinConditionOther: z.string().optional(),
});

export type MelasmaFormData =
  z.infer<typeof melasmaSchema>;

export const melasmaDefaultValues: MelasmaFormData = {
  fullName: "",
  country: "",
  phone: "",
  email: "",

  melasmaStarted: "",
  melasmaStartedOther: "",

  familyHistory: "",

  melasmaOnsetFactors: [],
  melasmaOnsetFactorsOther: "",

  hormonalFactors: [],

  heatExposure: [],
  heatExposureOther: "",

  sunscreenFrequency: "",

  sunscreenReaction: "",
  sunscreenReactionOther: "",

  psychologicalState: "",
  psychologicalStateOther: "",

  skinHealing: "",

  bleachingHistory: "",
  bleachingHistoryOther: "",

  bleachingResult: "",
  bleachingResultOther: "",

  worseningFactors: [],
  worseningFactorsOther: "",

  medicationUse: "",
  medicationDetails: "",

  melasmaProducts: [],
  melasmaProductsOther: "",

  skinType: "",
  skinTypeOther: "",

  currentSkinCondition: [],
  currentSkinConditionOther: "",
};