"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronLeft, ChevronRight, Shield } from "lucide-react";

import BookingProgress from "@/components/public/booking/BookingProgress";
import {
  QuestionTitle,
  TextField,
  TextAreaField,
  RadioQuestion,
} from "../(shared)/forms/FormFields";

import {
  generalDefaultValues,
  generalSchema,
  GeneralFormData,
} from "./clientJournal.schema";

// ── STEPS ──
const STEPS = [
  { id: 1, label: "የግል መረጃ", english: "Personal Info" },
  { id: 2, label: "የቆዳ ሁኔታ", english: "Skin Concern" },
  { id: 3, label: "የአኗኗር ዘይቤ", english: "Lifestyle" },
  { id: 4, label: "ፎቶዎች", english: "Photos" },
];

// ── OPTIONS ──
const SKIN_TYPES = [
  "መካከለኛ (Normal)",
  "ደረቅ (Dry)",
  "ወዛም (Oily)",
  "ጥምር (Combination)",
  "ቶሎ የሚቆጣ (Sensitive)",
  "አላውቅም",
];

const DAILY_EXPOSURE = ["አዎ", "አልፎ አልፎ", "በፍጹም"];

const MAKEUP_USE = ["ሁሌ", "አልፎ አልፎ", "በፍጹም"];

const PREGNANCY = ["አዎ", "በፍጹም"];

export default function GeneralJournalPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: generalDefaultValues,
  });

  // ── NEXT ──
  const goNext = async () => {
    let fields: (keyof GeneralFormData)[] = [];

    if (currentStep === 1) fields = ["fullName", "country", "phone"];
    if (currentStep === 2) fields = ["mainConcern", "allergies", "skinType"];
    if (currentStep === 3) fields = ["dailyExposure", "makeupUse", "pregnantOrBreastfeeding"];

    const valid = await trigger(fields);
    if (!valid) return;

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── BACK ──
  const goBack = () => {
    if (currentStep === 1) {
      router.push("/booking/slot");
      return;
    }

    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── SUBMIT ──
  const onSubmit = async (data: GeneralFormData) => {
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/consultation-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "general",
          fullName: data.fullName,
          email: data.email,
          mainConcern: data.mainConcern,
          goals: "General skin consultation",
          language: "Amharic",
          generalAssessment: data,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit form.");

      sessionStorage.setItem("booking_journal_submitted", "true");
      router.push("/booking/confirmation");
    } catch (error) {
      console.error("General form error:", error);
      setSubmitMessage("ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።");
    }
  };

  const currentStepInfo = STEPS[currentStep - 1];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F0F7F2" }}>
      {/* BOOKING PROGRESS */}
      <div className="sticky top-0 z-40 border-b border-black/5 bg-white">
        <BookingProgress currentStep={3} />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#9A7A2E" }}
              >
                Pre-Consultation
              </p>

              <h1
                className="mb-8 text-3xl font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A1F14" }}
              >
                Skin Assessment
              </h1>

              <div className="space-y-2">
                {STEPS.map((step) => {
                  const active = step.id === currentStep;
                  const completed = step.id < currentStep;

                  return (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 rounded-xl px-3 py-3"
                      style={{ backgroundColor: active ? "rgba(201,168,76,0.10)" : "transparent" }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: completed
                            ? "#0A1F14"
                            : active
                              ? "linear-gradient(135deg,#C9A84C,#9A7A2E)"
                              : "white",
                          color: completed || active ? "white" : "#0A1F14",
                          border: completed || active ? "none" : "1px solid rgba(10,31,20,0.15)",
                        }}
                      >
                        {step.id}
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold leading-5"
                          style={{ color: active ? "#0A1F14" : "rgba(10,31,20,0.55)" }}
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[11px]" style={{ color: "rgba(10,31,20,0.4)" }}>
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
                  style={{ background: "rgba(10,31,20,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStep / STEPS.length) * 100}%`,
                      background: "linear-gradient(90deg,#C9A84C,#9A7A2E)",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs" style={{ color: "rgba(10,31,20,0.4)" }}>
                  Step {currentStep} of {STEPS.length}
                </p>
              </div>
            </div>
          </aside>

          {/* ── FORM ── */}
          <section>
            {/* Mobile steps */}
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
                    color: step.id <= currentStep ? "white" : "#0A1F14",
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
              {/* Gold line */}
              <div
                className="h-[3px]"
                style={{ background: "linear-gradient(90deg,#C9A84C,#9A7A2E)" }}
              />

              {/* Header */}
              <div className="border-b border-black/5 px-6 py-7 md:px-10">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#9A7A2E" }}
                >
                  Step {currentStep}
                </span>
                <h2
                  className="mt-2 text-3xl font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A1F14" }}
                >
                  {currentStepInfo.label}
                </h2>
                <p className="mt-1 text-sm" style={{ color: "rgba(10,31,20,0.45)" }}>
                  {currentStepInfo.english}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 px-6 py-8 md:px-10">
                {/* ── STEP 1: Personal info ── */}
                {currentStep === 1 && (
                  <>
                    <div className="rounded-2xl p-6" style={{ backgroundColor: "#F0F7F2" }}>
                      <h3 className="text-xl font-semibold" style={{ color: "#0A1F14" }}>
                        እባክዎ ከቀይታዎ ሰዓት በፊት እነዚህን ጥያቄዎች ይመልሱ
                      </h3>
                    </div>

                    <TextField
                      label="ስም ከነአባት፡"
                      name="fullName"
                      register={register}
                      error={errors.fullName?.message}
                    />

                    <TextField
                      label="የሚኖሩበት ሃገር፡"
                      name="country"
                      register={register}
                      error={errors.country?.message}
                    />

                    <TextField
                      label="ከኛ ጋር የሚገናኙበት ሙሉ የዋትሳፕ/የቴሌግራም የስልክ ቁጥርዎ ከነአካባቢ ኮዱ፡ ለምሳሌ +97......."
                      name="phone"
                      register={register}
                      error={errors.phone?.message}
                    />

                    <TextField
                      label="ኢ-ሜል አድራሻ (አማራጭ)፡"
                      name="email"
                      type="email"
                      register={register}
                      error={errors.email?.message}
                    />
                  </>
                )}

                {/* ── STEP 2: Skin concern ── */}
                {currentStep === 2 && (
                  <>
                    <TextAreaField
                      number="1"
                      question="ማስተካከል(መቀየር) የሚፈልጉት ዋና የቆዳ ችግር (ፍላጎት) ምንድ ነው?"
                      name="mainConcern"
                      register={register}
                      error={errors.mainConcern?.message}
                    />

                    <TextAreaField
                      number="3"
                      question="ቆዳዎት የማይስማማው ወይም የሚያስቆጣው ነገር (አለርጂ) የሚያውቁት አለ?"
                      hint="ከሌለ «የለም» ብለው ይጻፉ"
                      name="allergies"
                      register={register}
                      error={errors.allergies?.message}
                      rows={3}
                    />

                    <RadioQuestion
                      number="4"
                      question="የቆዳዎት አይነት ምን አይነት ነው?"
                      hint="የማያውቁ ከሆነ አላውቅም ብለው ማለት ይችላሉ"
                      name="skinType"
                      options={SKIN_TYPES}
                      register={register}
                      error={errors.skinType?.message}
                    />
                  </>
                )}

                {/* ── STEP 3: Lifestyle ── */}
                {currentStep === 3 && (
                  <>
                    <RadioQuestion
                      number="5"
                      question="ለጸሃይ፣ ለሙቀት፣ ለአቧራ፣ ለመኪና ወይም ለሌላ ጭስ ዕለት ዕለት ተጋላጭ ኖት ማለት ይቻላል?"
                      name="dailyExposure"
                      options={DAILY_EXPOSURE}
                      register={register}
                      error={errors.dailyExposure?.message}
                    />

                    <RadioQuestion
                      number="6"
                      question="ሜካፕ ይጠቀማሉ?"
                      name="makeupUse"
                      options={MAKEUP_USE}
                      register={register}
                      error={errors.makeupUse?.message}
                    />

                    <RadioQuestion
                      number="7"
                      question="ነብሰጡር ኖት ወይም ያጠባሉ?"
                      name="pregnantOrBreastfeeding"
                      options={PREGNANCY}
                      register={register}
                      error={errors.pregnantOrBreastfeeding?.message}
                    />
                  </>
                )}

                {/* ── STEP 4: Photos ── */}
                {currentStep === 4 && (
                  <>
                    {/* Question 2: products */}
                    <div className="rounded-2xl border border-black/10 p-5 md:p-6">
                      <QuestionTitle
                        number="2"
                        text="ቆዳዎትን ለመንከባከብ የሚጠቀሟቸው ክሬሞች፣ ሴረሞች ...ወዘተ ካሉ ፎቶ ቢልኩልን?"
                      />
                      <div className="mt-5">
                        <TextField
                          label="የምርቶቹ ስም (አማራጭ)፡"
                          name="productNames"
                          register={register}
                        />
                      </div>
                    </div>

                    {/* Question 8: face photos */}
                    <div
                      className="rounded-2xl p-6"
                      style={{
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.25)",
                      }}
                    >
                      <QuestionTitle
                        number="8"
                        text="በጥሩ ብርሃን ካለምንም ሜካፕ የተነሱትን የፊት ለፊት እና የጎን ፎቶ ፍቃድዎ ከሆነ ቢልኩልን።"
                      />

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {["ሀ. የፊት ለፊት ፎቶ", "ለ. የጎን ፎቶ"].map((photo) => (
                          <div
                            key={photo}
                            className="rounded-xl bg-white p-4 text-sm font-medium"
                            style={{ color: "#0A1F14" }}
                          >
                            {photo}
                          </div>
                        ))}
                      </div>

                      <p className="mt-5 text-xs leading-5" style={{ color: "#9A7A2E" }}>
                        Photo upload will be connected separately so your images are
                        stored securely instead of as temporary browser links.
                      </p>
                    </div>

                    {/* Privacy */}
                    <div className="flex gap-3 rounded-xl p-4" style={{ background: "#F0F7F2" }}>
                      <Shield size={20} className="mt-0.5 shrink-0" style={{ color: "#9A7A2E" }} />
                      <p className="text-xs leading-6" style={{ color: "rgba(10,31,20,0.6)" }}>
                        ፎቶግራፎቱ ከኛ ጋር የሚቆየው የቀይታዎ ሰዓት እስኪጠናቀቅ ብቻ ነው። የቀይታዎ ሰዓት ሲጠናቀቅ ይጠፋል።
                      </p>
                    </div>
                  </>
                )}

                {/* Error */}
                {submitMessage && (
                  <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} className="shrink-0" />
                    {submitMessage}
                  </div>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div className="flex flex-col gap-5 border-t border-black/5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                  style={{ color: "#0A1F14", border: "1px solid rgba(10,31,20,0.15)" }}
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
                        width: step.id === currentStep ? "24px" : "6px",
                        background: step.id <= currentStep ? "#C9A84C" : "rgba(10,31,20,0.12)",
                      }}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg,#C9A84C,#9A7A2E)",
                      color: "#0A1F14",
                    }}
                  >
                    Continue
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-7 py-3 text-sm font-semibold disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg,#C9A84C,#9A7A2E)",
                      color: "#0A1F14",
                    }}
                  >
                    {isSubmitting ? "በመላክ ላይ..." : "መጠይቁን ላክ"}
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