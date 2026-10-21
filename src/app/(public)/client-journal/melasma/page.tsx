"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Shield,
  Upload,
  X,
} from "lucide-react";

import BookingProgress from "@/components/public/booking/BookingProgress";

import {
  melasmaDefaultValues,
  melasmaSchema,
  MelasmaFormData,
} from "./melasma.schema";

// ─────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    label: "የግል መረጃ",
    english: "Personal Info",
  },
  {
    id: 2,
    label: "የግል እና የጤና ታሪክ",
    english: "Health History",
  },
  {
    id: 3,
    label: "የሙቀት እና የፀሐይ ተጋላጭነት",
    english: "Sun & Heat",
  },
  {
    id: 4,
    label: "ስነ-ልቦናዊ ሁኔታዎች",
    english: "Skin Behaviour",
  },
  {
    id: 5,
    label: "ሕክምና እና ምርቶች",
    english: "Products",
  },
  {
    id: 6,
    label: "የአሁኑ የቆዳ ሁኔታ",
    english: "Current Skin",
  },
];

// ─────────────────────────────────────────────
// OPTIONS — EXACT SOURCE FORM TEXT
// ─────────────────────────────────────────────

const MELASMA_STARTED = [
  "ባለፉት 6 ወራት ውስጥ",
  "ከ 1 እስከ 2 ዓመት ባለው ጊዜ",
  "ከ 2 ዓመት በላይ",
  "ከ 6ወር ወዲህ ነው የጀመረኝ",
];

const FAMILY_HISTORY = [
  "አዎ፣ አለ",
  "የለም",
  "እርግጠኛ አይደለሁም",
];

const ONSET_FACTORS = [
  "ከወሊድ ጋር በተያያዘ ወይም ከታዮርይድ በሽታ ጋር በተያያዘ",
  "ለከፍተኛ የ ምድጃ፣ የካውያ ሙቀት፣ ሳውና ባዝ፣ እንፋሎት ከመጋለጥ ጋር በተያያዘ",
  "በከፍተኛ የጸሃይ ብርሃን መጋለጥ ጋር በተያያዘ",
  "ከተደጋጋሚ ቆዳ ማቃጠል፣ መለብለብ፣ መቅላት ጋር በተያያዘ",
  "ከመድሃኒት መጠቀም ጋር በተያያዘ ። ለምሳሌ ሃይድሮኩኖን፣ የተለያየ የሚቀቡ ነገሮችን፣ የሚጥል በሽታ ወይም ሌላ አይነት መድሃኒት ከመጠቀም ጋር በተያያዘ",
  "ከከፍተኛ የአይምሮ ጭንቀት ጋር በተገናኘ",
  "ሁሉም አይደለም",
  "አላውቀውም",
];

const HORMONAL_FACTORS = [
  "በአሁኑ ሰዓት እርጉዝ ነኝ / አባለሁ",
  "ምልክቱ የታየው ከወሊድ በኋላ ነው",
  "የወሊድ መከላከያ (ክኒን፣ መርፌ፣ በክንድ የሚቀበር) እጠቀማለሁ",
  "የታይሮይድ (Thyroid) እጢ ህመም አለብኝ",
  "ከእነዚህ ውስጥ አንዳቸውም አይገልጹኝም",
];

const HEAT_EXPOSURE = [
  "ለተለያየ ሙቀት (ለጸጉር ቤት ወይም ለልብስ መተኮሻ ካውያ ሙቀት )",
  "ለኩሽና ሙቀት (ምግብ ማብሰል፣ እንጀራ መጋገር፣ መጠባበስ ውዘተ)",
  "ለእንፋሎት (Steam/Sauna/ባህላዊ ታጥኖ)",
  "ለከፍተኛ የፀሐይ ብርሃን",
  "ለከፍተኛ ሙቀት በፍጹም አልጋለጥም",
  "ከላይ ለተጠቀሱት ነገሮች አልፎ አልፎ ብቻ ነው የምጋለጠው።",
];

const SUNSCREEN_FREQUENCY = [
  "በየቀኑ እና በየሁለት ሰዓቱ ደጋግሜ እቀባለሁ",
  "በቀን አንድ ጊዜ ብቻ እቀባለሁ",
  "አልፎ አልፎ (ውጪ ስወጣ ብቻ) እቀባለሁ",
  "በፍጹም የመጠቀም ልምድ የለኝም",
];

const SUNSCREEN_REACTION = [
  "አዎ",
  "አልፎ አልፎ",
  "በፍጹም",
];

const PSYCHOLOGICAL_STATE = [
  "ከፍተኛ የጭንቀት ስሜት (Stress)",
  "የሀዘን ስሜት ወይም ድብርት",
  "የእንቅልፍ መዛባት",
  "ምንም አይነት የስነልቦና ችግር ውስጥ አልነበርኩም",
];

const SKIN_HEALING = [
  "ጠቁሮ (ጥቁር ነጥብ ትቶ)",
  "ቀልቶ ብቻ",
  "ብጉር አይወጣብኝም",
  "ምንም አይነት ምልክት ሳይተው ይጠፋል",
];

const BLEACHING_HISTORY = [
  "አዎ፣ ለረጅም ጊዜ ተጠቅሜያለሁ",
  "አዎ፣ ለጥቂት ጊዜ ተጠቅሜያለሁ",
  "በፍጹም ተጠቅሜ አላውቅም",
  "እርግጠኛ አይደለሁም",
];

const BLEACHING_RESULT = [
  "ማድያቱ ተባብሶ ተመለሰ",
  "ለውጥ የለውም ። አቋርጬዋለሁ",
  "አሁንም እየተጠቀምኩ ነው ነገር ግን ለውጥ የለውም",
  "መጠነኛ አይቼበታለሁ",
];

const WORSENING_FACTORS = [
  "የፀሐይ ብርሃን (ጨረር)",
  "የሙቀት ተጋላጭነት (የምጣድ፣ የኩሽና፣የጸጉር መስሪያ ወይም ማድረቂያ ማሽን፣ የእንፋሎት ወዘተ))",
  "የሆርሞን ለውጥ (እርግዝና፣ የወሊድ መከላከያ)",
  "ከፍተኛ ጭንቀት (Stress) ወይም እንቅልፍ ማጣት",
  "አዳዲስ የቆዳ ምርቶችን መጠቀም",
  "አላውቀውም / እርግጠኛ አይደለሁም",
];

const MELASMA_PRODUCTS = [
  "በሃኪም የታዘዙልኝን ቅባቶች (መድሃኒቶች)",
  "እራሴ ከመድሃኒት ቤት፣ ከሱቅ፣ ከኦንላይን የገዛዋቸውን",
  "በቤት ውስጥ እራሴ እያዘጋጀው",
  "ለማድያቱ ምንም አልጠቀምም",
];

const SKIN_TYPES = [
  "ደረቅ የሚወጣጥር ፣ የሚጨመድድ፣ የሚሻክር",
  "ወዛም",
  "ቅልቅል (ግምባር፣ አፍንጫ እና አገጭ አካባቢ ወዛም ሆኖ ጉንጭ አካባቢ ደረቅ ወይም ኖርማል",
  "ኖርማል (መለስተኛ ወዝ፣ አይጨመድድም፣ አይሻክርም)",
  "አላውቀውም",
];

const CURRENT_SKIN_CONDITION = [
  "የፊት መሞቅ፣መጋል",
  "የቆዳ መቅላት",
  "የቆዳ መቆጥቆጥ",
  "በቀላሉ ብጉር የማውጣት",
  "የቆዳ ማሳከክ፣ ሽፍታ ማውጣት",
  "ከላይ የተጠቀሱት ነገሮች የሉኝም። ቆዳዬ የተረጋጋ ነው።",
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function MelasmaJournalPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [submitMessage, setSubmitMessage] =
    useState<string | null>(null);

  const [skinPhotos, setSkinPhotos] =
    useState<Record<string, string>>({});

  const [productPhotos, setProductPhotos] =
    useState<string[]>([]);

  const [uploadingSkinPhoto, setUploadingSkinPhoto] =
    useState<string | null>(null);

  const [isUploadingProducts, setIsUploadingProducts] =
    useState(false);

  const [uploadError, setUploadError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<MelasmaFormData>({
    resolver: zodResolver(melasmaSchema),
    defaultValues: melasmaDefaultValues,
  });

  // ───────────────────────────────────────────
  // NEXT
  // ───────────────────────────────────────────

  const goNext = async () => {
    let fields: (keyof MelasmaFormData)[] = [];

    if (currentStep === 1) {
      fields = [
        "fullName",
        "country",
        "phone",
      ];
    }

    if (currentStep === 2) {
      fields = [
        "melasmaStarted",
        "familyHistory",
        "melasmaOnsetFactors",
        "hormonalFactors",
      ];
    }

    if (currentStep === 3) {
      fields = [
        "heatExposure",
        "sunscreenFrequency",
        "sunscreenReaction",
      ];
    }

    if (currentStep === 4) {
      fields = [
        "psychologicalState",
        "skinHealing",
      ];
    }

    if (currentStep === 5) {
      fields = [
        "bleachingHistory",
        "bleachingResult",
        "worseningFactors",
        "melasmaProducts",
      ];
    }

    const valid = await trigger(fields);

    if (!valid) return;

    setCurrentStep((prev) =>
      Math.min(prev + 1, STEPS.length)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ───────────────────────────────────────────
  // BACK
  // ───────────────────────────────────────────

  const goBack = () => {
    if (currentStep === 1) {
      router.push("/booking/slot");
      return;
    }

    setCurrentStep((prev) =>
      Math.max(prev - 1, 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ───────────────────────────────────────────
  // PHOTO UPLOAD
  // ───────────────────────────────────────────

  const uploadImage = async (
    file: File
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to upload image."
      );
    }

    if (!result.url) {
      throw new Error(
        "Upload succeeded but no image URL was returned."
      );
    }

    return result.url;
  };

  const handleSkinPhotoUpload = async (
    slot: string,
    file: File
  ) => {
    setUploadError(null);
    setUploadingSkinPhoto(slot);

    try {
      const url = await uploadImage(file);

      setSkinPhotos((prev) => ({
        ...prev,
        [slot]: url,
      }));
    } catch (error) {
      console.error(
        "Melasma skin photo upload failed:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingSkinPhoto(null);
    }
  };

  const handleProductPhotosUpload = async (
    files: FileList | null
  ) => {
    if (!files?.length) return;

    setUploadError(null);
    setIsUploadingProducts(true);

    try {
      const remaining =
        8 - productPhotos.length;

      const selectedFiles = Array.from(
        files
      ).slice(0, remaining);

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      setProductPhotos((prev) => [
        ...prev,
        ...uploadedUrls,
      ]);
    } catch (error) {
      console.error(
        "Melasma product photo upload failed:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setIsUploadingProducts(false);
    }
  };

  const removeSkinPhoto = (
    slot: string
  ) => {
    setSkinPhotos((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  const removeProductPhoto = (
    url: string
  ) => {
    setProductPhotos((prev) =>
      prev.filter(
        (photo) => photo !== url
      )
    );
  };

  // ───────────────────────────────────────────
  // SUBMIT
  // ───────────────────────────────────────────

  const onSubmit = async (
    data: MelasmaFormData
  ) => {
    setSubmitMessage(null);

    try {
      const response = await fetch(
        "/api/consultation-form",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            formType: "melasma",

            fullName: data.fullName,

            // Authenticated email is authoritative
            // in the API. This value is still stored
            // inside the assessment.
            email: data.email,

            mainConcern:
              "Melasma / Hyperpigmentation",

            goals:
              "Melasma assessment",

            language: "Amharic",

            skinPhotos:
              Object.values(skinPhotos),

            productPhotos,

            melasmaAssessment: data,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit form."
        );
      }

      sessionStorage.setItem(
        "booking_journal_submitted",
        "true"
      );

      router.push(
        "/booking/confirmation"
      );
    } catch (error) {
      console.error(
        "Melasma form error:",
        error
      );

      setSubmitMessage(
        "ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።"
      );
    }
  };

  const currentStepInfo =
    STEPS[currentStep - 1];

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#F0F7F2",
      }}
    >
      {/* BOOKING PROGRESS */}

      <div className="sticky top-0 z-40 border-b border-black/5 bg-white">
        <BookingProgress currentStep={3} />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* ─────────────────────────────────
              SIDEBAR
          ───────────────────────────────── */}

          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: "#9A7A2E",
                }}
              >
                Pre-Consultation
              </p>

              <h1
                className="mb-8 text-3xl font-semibold"
                style={{
                  fontFamily:
                    "'Cormorant Garamond', serif",

                  color: "#0A1F14",
                }}
              >
                Melasma Assessment
              </h1>

              <div className="space-y-2">
                {STEPS.map((step) => {
                  const active =
                    step.id === currentStep;

                  const completed =
                    step.id < currentStep;

                  return (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 rounded-xl px-3 py-3"
                      style={{
                        backgroundColor: active
                          ? "rgba(201,168,76,0.10)"
                          : "transparent",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: completed
                            ? "#0A1F14"
                            : active
                              ? "linear-gradient(135deg,#C9A84C,#9A7A2E)"
                              : "white",

                          color:
                            completed || active
                              ? "white"
                              : "#0A1F14",

                          border:
                            completed || active
                              ? "none"
                              : "1px solid rgba(10,31,20,0.15)",
                        }}
                      >
                        {step.id}
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold leading-5"
                          style={{
                            color: active
                              ? "#0A1F14"
                              : "rgba(10,31,20,0.55)",
                          }}
                        >
                          {step.label}
                        </p>

                        <p
                          className="mt-0.5 text-[11px]"
                          style={{
                            color:
                              "rgba(10,31,20,0.4)",
                          }}
                        >
                          {step.english}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <div
                  className="h-1 overflow-hidden rounded-full"
                  style={{
                    background:
                      "rgba(10,31,20,0.08)",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (currentStep /
                          STEPS.length) *
                        100
                      }%`,

                      background:
                        "linear-gradient(90deg,#C9A84C,#9A7A2E)",
                    }}
                  />
                </div>

                <p
                  className="mt-2 text-xs"
                  style={{
                    color:
                      "rgba(10,31,20,0.4)",
                  }}
                >
                  Step {currentStep} of{" "}
                  {STEPS.length}
                </p>
              </div>
            </div>
          </aside>

          {/* ─────────────────────────────────
              FORM
          ───────────────────────────────── */}

          <section>
            {/* MOBILE STEPS */}

            <div className="mb-6 flex justify-center gap-2 lg:hidden">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background:
                      step.id === currentStep
                        ? "linear-gradient(135deg,#C9A84C,#9A7A2E)"
                        : step.id < currentStep
                          ? "#0A1F14"
                          : "white",

                    color:
                      step.id <= currentStep
                        ? "white"
                        : "#0A1F14",
                  }}
                >
                  {step.id}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_50px_rgba(10,31,20,0.08)]"
            >
              {/* GOLD LINE */}

              <div
                className="h-[3px]"
                style={{
                  background:
                    "linear-gradient(90deg,#C9A84C,#9A7A2E)",
                }}
              />

              {/* HEADER */}

              <div className="border-b border-black/5 px-6 py-7 md:px-10">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: "#9A7A2E",
                  }}
                >
                  Step {currentStep}
                </span>

                <h2
                  className="mt-2 text-3xl font-semibold"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', serif",

                    color: "#0A1F14",
                  }}
                >
                  {currentStepInfo.label}
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "rgba(10,31,20,0.45)",
                  }}
                >
                  {currentStepInfo.english}
                </p>
              </div>

              {/* CONTENT */}

              <div className="space-y-8 px-6 py-8 md:px-10">
                {/* ═══════════════════════════
                    STEP 1
                ═══════════════════════════ */}

                {currentStep === 1 && (
                  <>
                    <IntroBox />

                    <TextField
                      label="ስም ከነአባት፡"
                      register={register}
                      name="fullName"
                      error={
                        errors.fullName?.message
                      }
                    />

                    <TextField
                      label="የሚኖሩበት ሃገር፡"
                      register={register}
                      name="country"
                      error={
                        errors.country?.message
                      }
                    />

                    <TextField
                      label="ከኛ ጋር የሚገናኙበት ሙሉ የዋትሳፕ/የቴሌግራም የስልክ ቁጥርዎ ከነአካባቢ ኮዱ፡ ለምሳሌ +97......."
                      register={register}
                      name="phone"
                      error={
                        errors.phone?.message
                      }
                    />

                    <TextField
                      label="ኢ-ሜል አድራሻ (አማራጭ)፡"
                      register={register}
                      name="email"
                      type="email"
                      error={
                        errors.email?.message
                      }
                    />
                  </>
                )}

                {/* ═══════════════════════════
                    STEP 2
                ═══════════════════════════ */}

                {currentStep === 2 && (
                  <>
                    <RadioQuestion
                      number="፩"
                      question="የማድያት ወይም የቆዳ ቀለም ለውጥ ምልክቱ የታየው መቼ ነው?"
                      name="melasmaStarted"
                      options={
                        MELASMA_STARTED
                      }
                      register={register}
                      error={
                        errors.melasmaStarted
                          ?.message
                      }
                      otherName="melasmaStartedOther"
                    />

                    <RadioQuestion
                      number="፪"
                      question="በቤተሰብዎ (እናት፣ እህት...) ውስጥ ተመሳሳይ ችግር ያለበት ሰው አለ?"
                      name="familyHistory"
                      options={FAMILY_HISTORY}
                      register={register}
                      error={
                        errors.familyHistory
                          ?.message
                      }
                    />

                    <CheckboxQuestion
                      number="፪.፩"
                      question="ማድያቱ የተከሰተብትን አጋጣሚ የትኛው በተሻለ ይገልጸዋል?"
                      hint="ከ1 በላይ መምረጥ ይቻላል"
                      name="melasmaOnsetFactors"
                      options={ONSET_FACTORS}
                      register={register}
                      error={
                        errors
                          .melasmaOnsetFactors
                          ?.message
                      }
                      otherName="melasmaOnsetFactorsOther"
                    />

                    <CheckboxQuestion
                      number="፫"
                      question="ከሚከተሉት የሆርሞን ሁኔታዎች የትኛው ይገልጽዎታል?"
                      hint="ከአንድ በላይ መምረጥ ይቻላል"
                      name="hormonalFactors"
                      options={
                        HORMONAL_FACTORS
                      }
                      register={register}
                      error={
                        errors.hormonalFactors
                          ?.message
                      }
                    />
                  </>
                )}

                {/* ═══════════════════════════
                    STEP 3
                ═══════════════════════════ */}

                {currentStep === 3 && (
                  <>
                    <CheckboxQuestion
                      number="፬"
                      question="በቤት ውስጥ ወይም በስራ ቦታ ለየትኛው የሙቀት ምንጭ በብዛት ይጋለጣሉ?"
                      hint="ከ1 በላይ መምረጥ ይቻላል"
                      name="heatExposure"
                      options={HEAT_EXPOSURE}
                      register={register}
                      error={
                        errors.heatExposure
                          ?.message
                      }
                      otherName="heatExposureOther"
                    />

                    <RadioQuestion
                      number="፭"
                      question="የፀሐይ መከላከያ (Sunscreen) የመጠቀም ልምድዎ ምን ይመስላል?"
                      name="sunscreenFrequency"
                      options={
                        SUNSCREEN_FREQUENCY
                      }
                      register={register}
                      error={
                        errors
                          .sunscreenFrequency
                          ?.message
                      }
                    />

                    <RadioQuestion
                      number="፮"
                      question="የፀሐይ መከላከያ (Sunscreen) ሲጠቀሙ የመለብለብ ስሜት ያጋጥሞታል?"
                      name="sunscreenReaction"
                      options={
                        SUNSCREEN_REACTION
                      }
                      register={register}
                      error={
                        errors
                          .sunscreenReaction
                          ?.message
                      }
                      otherName="sunscreenReactionOther"
                    />
                  </>
                )}

                {/* ═══════════════════════════
                    STEP 4
                ═══════════════════════════ */}

                {currentStep === 4 && (
                  <>
                    <RadioQuestion
                      number="፯"
                      question="ማድያቱ ከመከሰቱ በፊት የነበሩበት የስነ-ልቦና ሁኔታ ምን ይመስል ነበር?"
                      name="psychologicalState"
                      options={
                        PSYCHOLOGICAL_STATE
                      }
                      register={register}
                      error={
                        errors
                          .psychologicalState
                          ?.message
                      }
                      otherName="psychologicalStateOther"
                    />

                    <RadioQuestion
                      number="፰"
                      question="ፊትዎ ላይ ብጉር ወይም ቁስል ሲወጣ እንዴት ነው የሚድነው?"
                      name="skinHealing"
                      options={SKIN_HEALING}
                      register={register}
                      error={
                        errors.skinHealing
                          ?.message
                      }
                    />
                  </>
                )}

                {/* ═══════════════════════════
                    STEP 5
                ═══════════════════════════ */}

                {currentStep === 5 && (
                  <>
                    <RadioQuestion
                      number="፱"
                      question="ከዚህ በፊት የቆዳዎን ጥቁረት ለማፈገግ (ለመቀነስ) (Bleaching/Lightening) ክሬሞችን ተጠቀመው ያውቃሉ? ለምሳሌ Hydroquinone, Betamethasone, Betnovate, Movate, Tenovate, Mometasone (Elocone)"
                      name="bleachingHistory"
                      options={
                        BLEACHING_HISTORY
                      }
                      register={register}
                      error={
                        errors
                          .bleachingHistory
                          ?.message
                      }
                      otherName="bleachingHistoryOther"
                    />

                    <RadioQuestion
                      number="፲"
                      question="ከላይ ከተዘረዘሩት ውስጥ ተጥቅመው ከነበረ ምን አይነት ለውጥ አገኙ?"
                      name="bleachingResult"
                      options={
                        BLEACHING_RESULT
                      }
                      register={register}
                      error={
                        errors
                          .bleachingResult
                          ?.message
                      }
                      otherName="bleachingResultOther"
                    />

                    <CheckboxQuestion
                      number="፲፩"
                      question="ማድያትዎ እንዲባባስ ሲያደርግ ያስተዋሉት ነገር ይኖር ይሆን?"
                      hint="ከአንድ በላይ መምረጥ ይቻላል"
                      name="worseningFactors"
                      options={
                        WORSENING_FACTORS
                      }
                      register={register}
                      error={
                        errors
                          .worseningFactors
                          ?.message
                      }
                      otherName="worseningFactorsOther"
                    />

                    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
                      <QuestionTitle
                        number="፲፪"
                        text="ለሌላ የጤና ችግር የሚወስዱት ቋሚ መድኃኒት አለ?"
                      />

                      <div className="mt-5 space-y-5">
                        <TextField
                          label="ሀ. አዎ — የመድኃኒቱን ስም ወይም ለምን ህመም እንደሚወስዱት ይጥቀሱ"
                          register={register}
                          name="medicationDetails"
                        />

                        <TextField
                          label="ለ. የለም"
                          register={register}
                          name="medicationUse"
                        />
                      </div>
                    </div>

                    <CheckboxQuestion
                      number="፲፫"
                      question="ለማድያትዎ ምን ይጠቀማሉ ? (መታጠቢያ ሳሙናን፣ የፊት ክሬምን እና የጸሃይ መከላከያን ሳይጨምር)"
                      hint="ከ1 በላይ መመረጥ ይቻላል"
                      name="melasmaProducts"
                      options={
                        MELASMA_PRODUCTS
                      }
                      register={register}
                      error={
                        errors
                          .melasmaProducts
                          ?.message
                      }
                      otherName="melasmaProductsOther"
                    />
                  </>
                )}

                {/* ═══════════════════════════
                    STEP 6
                ═══════════════════════════ */}

                {currentStep === 6 && (
                  <>
                    <RadioQuestion
                      number="፲፬"
                      question="የቆዳዎ አይነት ምን ይመስላል ?"
                      name="skinType"
                      options={SKIN_TYPES}
                      register={register}
                      error={
                        errors.skinType
                          ?.message
                      }
                      otherName="skinTypeOther"
                    />

                    <CheckboxQuestion
                      number="፲፭"
                      question="አሁናዊው የቆዳዎን ሁኔታ ቀጥሎ ከተዘረዘሩት ውስጥ የትኛው በተሻለ ይገልጸዋል ?"
                      hint="ከ1 በላይ መምረጥ ይቻላል"
                      name="currentSkinCondition"
                      options={
                        CURRENT_SKIN_CONDITION
                      }
                      register={register}
                      error={
                        errors
                          .currentSkinCondition
                          ?.message
                      }
                      otherName="currentSkinConditionOther"
                    />

                    {/* PHOTO INSTRUCTIONS */}

                    <div
                      className="rounded-2xl p-6"
                      style={{
                        background:
                          "rgba(201,168,76,0.08)",

                        border:
                          "1px solid rgba(201,168,76,0.25)",
                      }}
                    >
                      <h3
                        className="text-xl font-semibold"
                        style={{
                          color: "#0A1F14",
                        }}
                      >
                        ክፍል ፬፡ የፎቶዎ እና
                        የሚጠቀሙባቸውን የቆዳ
                        ምርቶች
                      </h3>

                      <p
                        className="mt-4 text-sm leading-7"
                        style={{
                          color:
                            "rgba(10,31,20,0.7)",
                        }}
                      >
                        የቆዳዎን ሁኔታ በትክክል
                        እንድንረዳ እባክዎን 3
                        አይነት ፎቶዎች በጥራት
                        አንስተው ያዘጋጁ።
                      </p>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {[
                          "ሀ. የፊት ለፊት ቀጥታ ፎቶ",
                          "ለ. የግራ ጎን ፊት ፎቶ",
                          "ሐ. የቀኝ ጎን ፊት ፎቶ",
                        ].map((photo) => (
                          <div
                            key={photo}
                            className="rounded-xl bg-white p-4 text-sm font-medium"
                            style={{
                              color:
                                "#0A1F14",
                            }}
                          >
                            {photo}
                          </div>
                        ))}
                      </div>

                      <div
                        className="mt-5 space-y-2 text-sm leading-6"
                        style={{
                          color:
                            "rgba(10,31,20,0.65)",
                        }}
                      >
                        <p>
                          • የቀን ብርሃን
                          ይጠቀሙ።
                        </p>

                        <p>
                          • መስኮት አጠገብ ሆነው
                          ይነሱ። Flash
                          አይጠቀሙ።
                        </p>

                        <p>
                          • ሜካፕ ወይም ፓውደር
                          በፍጹም አይቀቡ።
                        </p>
                      </div>

                      <p
                        className="mt-5 text-xs leading-5"
                        style={{
                          color: "#9A7A2E",
                        }}
                      >
                        JPG, PNG or WebP. Maximum 8 MB
                        per photo.
                      </p>
                    </div>

                    {/* PHOTO UPLOAD */}

                    <div className="space-y-6">
                      {uploadError && (
                        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                          />

                          <span>{uploadError}</span>
                        </div>
                      )}

                      <div>
                        <div className="mb-4">
                          <h3
                            className="text-lg font-semibold"
                            style={{
                              color: "#0A1F14",
                            }}
                          >
                            የፊት ፎቶዎች — 3 አቅጣጫዎች
                          </h3>

                          <p
                            className="mt-1 text-sm"
                            style={{
                              color:
                                "rgba(10,31,20,0.55)",
                            }}
                          >
                            JPG, PNG or WebP. Maximum 8
                            MB per photo.
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          {[
                            {
                              key: "front",
                              title:
                                "የፊት ለፊት ቀጥታ ፎቶ",
                              subtitle:
                                "Front Face",
                            },
                            {
                              key: "left",
                              title:
                                "የግራ ጎን ፊት ፎቶ",
                              subtitle:
                                "Left Profile",
                            },
                            {
                              key: "right",
                              title:
                                "የቀኝ ጎን ፊት ፎቶ",
                              subtitle:
                                "Right Profile",
                            },
                          ].map((slot) => {
                            const photo =
                              skinPhotos[
                                slot.key
                              ];

                            const uploading =
                              uploadingSkinPhoto ===
                              slot.key;

                            return (
                              <div
                                key={slot.key}
                                className="relative overflow-hidden rounded-2xl border bg-white"
                                style={{
                                  borderColor:
                                    "rgba(201,168,76,0.28)",
                                }}
                              >
                                {photo ? (
                                  <div className="relative aspect-[4/3]">
                                    <img
                                      src={photo}
                                      alt={
                                        slot.subtitle
                                      }
                                      className="h-full w-full object-cover"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSkinPhoto(
                                          slot.key
                                        )
                                      }
                                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg"
                                      style={{
                                        backgroundColor:
                                          "#0A1F14",
                                      }}
                                      aria-label={`Remove ${slot.subtitle}`}
                                    >
                                      <X
                                        size={17}
                                      />
                                    </button>

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-10">
                                      <p className="text-sm font-semibold text-white">
                                        {
                                          slot.title
                                        }
                                      </p>

                                      <p className="text-xs text-white/75">
                                        {
                                          slot.subtitle
                                        }
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 p-5 text-center transition hover:bg-[#F0F7F2]">
                                    <div
                                      className="flex h-12 w-12 items-center justify-center rounded-full"
                                      style={{
                                        background:
                                          "rgba(201,168,76,0.12)",
                                        color:
                                          "#9A7A2E",
                                      }}
                                    >
                                      <Camera
                                        size={21}
                                      />
                                    </div>

                                    <div>
                                      <p
                                        className="text-sm font-semibold"
                                        style={{
                                          color:
                                            "#0A1F14",
                                        }}
                                      >
                                        {
                                          slot.title
                                        }
                                      </p>

                                      <p
                                        className="mt-1 text-xs"
                                        style={{
                                          color:
                                            "rgba(10,31,20,0.5)",
                                        }}
                                      >
                                        {uploading
                                          ? "Uploading..."
                                          : slot.subtitle}
                                      </p>
                                    </div>

                                    <span
                                      className="rounded-full px-4 py-2 text-xs font-semibold"
                                      style={{
                                        background:
                                          "rgba(201,168,76,0.12)",
                                        color:
                                          "#9A7A2E",
                                      }}
                                    >
                                      {uploading
                                        ? "Uploading..."
                                        : "Upload photo"}
                                    </span>

                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      className="hidden"
                                      disabled={
                                        uploading
                                      }
                                      onChange={(
                                        event
                                      ) => {
                                        const file =
                                          event
                                            .target
                                            .files?.[0];

                                        if (file) {
                                          void handleSkinPhotoUpload(
                                            slot.key,
                                            file
                                          );
                                        }

                                        event.target.value =
                                          "";
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* PRODUCT PHOTOS */}

                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: "#0A1F14",
                          }}
                        >
                          የሚጠቀሙባቸው የቆዳ ምርቶች
                        </h3>

                        <p
                          className="mt-1 text-sm leading-6"
                          style={{
                            color:
                              "rgba(10,31,20,0.55)",
                          }}
                        >
                          አሁን የሚጠቀሙባቸውን የቆዳ
                          ምርቶች ፎቶ መላክ ይችላሉ።
                          Maximum 8 photos.
                        </p>

                        <label
                          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition hover:bg-[#F0F7F2]"
                          style={{
                            borderColor:
                              "rgba(201,168,76,0.4)",
                          }}
                        >
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{
                              background:
                                "rgba(201,168,76,0.12)",
                              color:
                                "#9A7A2E",
                            }}
                          >
                            <Upload
                              size={20}
                            />
                          </div>

                          <p
                            className="mt-3 text-sm font-semibold"
                            style={{
                              color:
                                "#0A1F14",
                            }}
                          >
                            {isUploadingProducts
                              ? "Uploading product photos..."
                              : "Upload product photos"}
                          </p>

                          <p
                            className="mt-1 text-xs"
                            style={{
                              color:
                                "rgba(10,31,20,0.45)",
                            }}
                          >
                            JPG, PNG or WebP · max 8
                            MB each
                          </p>

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="hidden"
                            disabled={
                              isUploadingProducts ||
                              productPhotos.length >=
                                8
                            }
                            onChange={(
                              event
                            ) => {
                              void handleProductPhotosUpload(
                                event.target
                                  .files
                              );

                              event.target.value =
                                "";
                            }}
                          />
                        </label>

                        {productPhotos.length >
                          0 && (
                          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {productPhotos.map(
                              (
                                photo,
                                index
                              ) => (
                                <div
                                  key={photo}
                                  className="relative aspect-square overflow-hidden rounded-xl border border-black/10"
                                >
                                  <img
                                    src={
                                      photo
                                    }
                                    alt={`Product ${
                                      index +
                                      1
                                    }`}
                                    className="h-full w-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeProductPhoto(
                                        photo
                                      )
                                    }
                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow"
                                    style={{
                                      backgroundColor:
                                        "#0A1F14",
                                    }}
                                    aria-label="Remove product photo"
                                  >
                                    <X
                                      size={
                                        15
                                      }
                                    />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {productPhotos.length >
                          0 && (
                          <p
                            className="mt-3 text-xs"
                            style={{
                              color:
                                "rgba(10,31,20,0.5)",
                            }}
                          >
                            {
                              productPhotos.length
                            }{" "}
                            of 8 product photos
                            uploaded.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PRIVACY */}

                    <div
                      className="flex gap-3 rounded-xl p-4"
                      style={{
                        background:
                          "#F0F7F2",
                      }}
                    >
                      <Shield
                        size={20}
                        className="mt-0.5 shrink-0"
                        style={{
                          color: "#9A7A2E",
                        }}
                      />

                      <p
                        className="text-xs leading-6"
                        style={{
                          color:
                            "rgba(10,31,20,0.6)",
                        }}
                      >
                        የሚልኩልን መረጃዎች
                        በሚስጥር የተጠበቁ
                        ናቸው። መረጃዎቹ
                        የሚውሉት ለቆዳዎ
                        ምርመራና ምክክር ብቻ
                        ነው።
                      </p>
                    </div>
                  </>
                )}

                {/* ERROR */}

                {submitMessage && (
                  <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle
                      size={18}
                      className="shrink-0"
                    />

                    {submitMessage}
                  </div>
                )}
              </div>

              {/* ─────────────────────────────────
                  FOOTER
              ───────────────────────────────── */}

              <div className="flex flex-col gap-5 border-t border-black/5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                  style={{
                    color: "#0A1F14",

                    border:
                      "1px solid rgba(10,31,20,0.15)",
                  }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <div className="flex justify-center gap-1.5">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width:
                          step.id ===
                          currentStep
                            ? "24px"
                            : "6px",

                        background:
                          step.id <=
                          currentStep
                            ? "#C9A84C"
                            : "rgba(10,31,20,0.12)",
                      }}
                    />
                  ))}
                </div>

                {currentStep <
                STEPS.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg,#C9A84C,#9A7A2E)",

                      color: "#0A1F14",
                    }}
                  >
                    Continue
                    <ChevronRight
                      size={16}
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      Boolean(uploadingSkinPhoto) ||
                      isUploadingProducts
                    }
                    className="rounded-full px-7 py-3 text-sm font-semibold disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg,#C9A84C,#9A7A2E)",

                      color: "#0A1F14",
                    }}
                  >
                    {isSubmitting
                      ? "በመላክ ላይ..."
                      : uploadingSkinPhoto ||
                          isUploadingProducts
                        ? "ፎቶ በመጫን ላይ..."
                        : "መጠይቁን ላክ"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

// ═════════════════════════════════════════════
// INTRO
// ═════════════════════════════════════════════

function IntroBox() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#F0F7F2",
      }}
    >
      <h3
        className="text-xl font-semibold"
        style={{
          color: "#0A1F14",
        }}
      >
        የማድያት እና የቆዳ ቀለም ለውጥ
        ቅድመ-ምርመራ መጠይቅ
      </h3>

      <p
        className="mt-4 text-sm leading-7"
        style={{
          color: "rgba(10,31,20,0.65)",
        }}
      >
        ውድ ደንበኞቻችን፤ ውጤታማ የሆነ
        አገልግሎት ለማግኘት ይህንን መጠይቅ
        በእርጋታና በሚገባ መሙላት እጅግ
        አስፈላጊ ነው።
      </p>

      <p
        className="mt-3 text-sm leading-7"
        style={{
          color: "rgba(10,31,20,0.65)",
        }}
      >
        የሚልኩልን ማናቸውም መረጃዎችና
        ፎቶዎች በሚስጥር የተጠበቁ ናቸው።
      </p>
    </div>
  );
}

// ═════════════════════════════════════════════
// QUESTION TITLE
// ═════════════════════════════════════════════

function QuestionTitle({
  number,
  text,
  hint,
}: {
  number?: string;
  text: string;
  hint?: string;
}) {
  return (
    <div>
      <h3
        className="text-[15px] font-semibold leading-7"
        style={{
          color: "#0A1F14",
        }}
      >
        {number && (
          <span
            className="mr-2"
            style={{
              color: "#9A7A2E",
            }}
          >
            {number}.
          </span>
        )}

        {text}
      </h3>

      {hint && (
        <p
          className="mt-1 text-xs"
          style={{
            color: "#9A7A2E",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════
// TEXT FIELD
// ═════════════════════════════════════════════

function TextField({
  label,
  name,
  register,
  error,
  type = "text",
}: {
  label: string;
  name: keyof MelasmaFormData;
  register: UseFormRegister<MelasmaFormData>;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium leading-6"
        style={{
          color: "#0A1F14",
        }}
      >
        {label}
      </label>

      <input
        {...register(name)}
        type={type}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition focus:ring-2"
        style={{
          borderColor: error
            ? "#ef4444"
            : "rgba(10,31,20,0.15)",

          // @ts-expect-error CSS variable
          "--tw-ring-color":
            "rgba(201,168,76,0.3)",
        }}
      />

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════
// RADIO
// ═════════════════════════════════════════════

function RadioQuestion({
  number,
  question,
  name,
  options,
  register,
  error,
  otherName,
}: {
  number: string;
  question: string;
  name: keyof MelasmaFormData;
  options: string[];
  register: UseFormRegister<MelasmaFormData>;
  error?: string;
  otherName?: keyof MelasmaFormData;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
      <QuestionTitle
        number={number}
        text={question}
      />

      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-[#F0F7F2]"
          >
            <input
              {...register(name)}
              type="radio"
              value={option}
              className="mt-1 h-4 w-4 accent-[#9A7A2E]"
            />

            <span
              className="text-sm leading-6"
              style={{
                color:
                  "rgba(10,31,20,0.78)",
              }}
            >
              {option}
            </span>
          </label>
        ))}

        {otherName && (
          <div className="flex items-center gap-3 px-3 pt-2">
            <span className="text-sm">
              Other:
            </span>

            <input
              {...register(otherName)}
              type="text"
              className="flex-1 border-b border-black/20 bg-transparent px-2 py-2 text-sm outline-none focus:border-[#C9A84C]"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════
// CHECKBOX
// ═════════════════════════════════════════════

function CheckboxQuestion({
  number,
  question,
  hint,
  name,
  options,
  register,
  error,
  otherName,
}: {
  number: string;
  question: string;
  hint?: string;
  name: keyof MelasmaFormData;
  options: string[];
  register: UseFormRegister<MelasmaFormData>;
  error?: string;
  otherName?: keyof MelasmaFormData;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
      <QuestionTitle
        number={number}
        text={question}
        hint={hint}
      />

      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-[#F0F7F2]"
          >
            <input
              {...register(name)}
              type="checkbox"
              value={option}
              className="mt-1 h-4 w-4 rounded accent-[#9A7A2E]"
            />

            <span
              className="text-sm leading-6"
              style={{
                color:
                  "rgba(10,31,20,0.78)",
              }}
            >
              {option}
            </span>
          </label>
        ))}

        {otherName && (
          <div className="flex items-center gap-3 px-3 pt-2">
            <span className="text-sm">
              Other:
            </span>

            <input
              {...register(otherName)}
              type="text"
              className="flex-1 border-b border-black/20 bg-transparent px-2 py-2 text-sm outline-none focus:border-[#C9A84C]"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}