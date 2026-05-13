"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Camera,
  ChevronRight,
  Shield,
  Upload,
  X,
} from "lucide-react";

import BookingProgress from "@/components/public/booking/BookingProgress";

import {
  clientJournalDefaultValues,
  clientJournalSchema,
  ClientJournalFormData,
} from "./clientJournal.schema";

const triggerOptions = [
  "Pregnancy / postpartum",
  "Hormonal contraceptives (pill, implant)",
  "Hormone replacement therapy",
  "High sun exposure / no SPF history",
  "Previous bleaching cream use",
  "Acne / post-inflammatory marks",
  "Eczema / dermatitis",
  "Thyroid condition",
  "Diabetes",
  "Chronic stress",
  "Family history of melasma",
  "Previous professional skin treatment",
];

const photoSlots = [
  { key: "front", title: "Front Face", subtitle: "Looking straight at camera", icon: "📸" },
  { key: "left", title: "Left Profile", subtitle: "Turn slightly to the left", icon: "↩️" },
  { key: "right", title: "Right Profile", subtitle: "Turn slightly to the right", icon: "↪️" },
];

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Skin Concern" },
  { id: 3, label: "History" },
  { id: 4, label: "Routine" },
  { id: 5, label: "Photos" },
  { id: 6, label: "Goals" },
];

export default function ClientJournalPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [skinPhotos, setSkinPhotos] = useState<Record<string, string>>({});
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientJournalFormData, unknown, ClientJournalFormData>({
    resolver: zodResolver(clientJournalSchema),
    defaultValues: clientJournalDefaultValues,
  });

  const selectedTriggers = watch("triggers") || [];

  const toggleTrigger = (value: string) => {
    setValue(
      "triggers",
      selectedTriggers.includes(value)
        ? selectedTriggers.filter((i) => i !== value)
        : [...selectedTriggers, value],
      { shouldValidate: true }
    );
  };

  const handleSkinPhotoUpload = (
    slotKey: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSkinPhotos((prev) => ({
      ...prev,
      [slotKey]: URL.createObjectURL(file),
    }));
  };

  const handleProductPhotosUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProductPhotos((prev) =>
      [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8)
    );
  };

  const removeProductPhoto = (index: number) => {
    setProductPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSkinPhoto = (slotKey: string) => {
    setSkinPhotos((prev) => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });
  };

  const goNext = async () => {
    let fields: (keyof ClientJournalFormData)[] = [];

    if (currentStep === 1) fields = ["fullName", "email"];
    if (currentStep === 2) fields = ["mainConcern"];
    if (currentStep === 6) fields = ["goals", "language"];

    const valid = fields.length > 0 ? await trigger(fields) : true;
    if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push("/booking/slot");
      return;
    }

    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: ClientJournalFormData) => {
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/consultation-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          skinPhotos: Object.values(skinPhotos),
          productPhotos,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed.");

      sessionStorage.setItem("booking_journal_submitted", "true");
      router.push("/booking/confirmation");
    } catch (error) {
      console.error(error);
      setSubmitMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const editSubmission = () => {
    setSubmitMessage(null);
  };

  const newSubmission = () => {
    reset();
    setSkinPhotos({});
    setProductPhotos([]);
    setCurrentStep(1);
    setSubmitMessage(null);
  };

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#F0F7F2" }}>
      <div
        className="sticky top-0 z-40 bg-white"
        style={{ borderBottom: "1px solid rgba(10,31,20,0.08)" }}
      >
        <BookingProgress currentStep={3} />
      </div>

      {submitMessage?.type === "success" ? (
        <section
          className="flex min-h-screen items-center justify-center px-6 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="mx-auto max-w-xl">
            <div
              className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #6EE7A8, #34D399)",
                boxShadow: "0 12px 34px rgba(52,211,153,0.2)",
              }}
            >
              <span className="text-3xl font-bold text-white">✓</span>
            </div>

            <h1
              className="mb-4 font-semibold leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                color: "#0A1F14",
                letterSpacing: "-0.02em",
              }}
            >
              Questionnaire Submitted Successfully
            </h1>

            <p
              className="mx-auto mb-8 max-w-md text-sm leading-6"
              style={{ color: "rgba(10,31,20,0.5)" }}
            >
              Thank you! Brook will review your answers and photos before your session.
              You&apos;ll hear back within 24 hours via WhatsApp or email.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={editSubmission}
                className="rounded-2xl px-10 py-3.5 text-sm font-bold transition hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "white",
                  boxShadow: "0 8px 28px rgba(201,168,76,0.3)",
                }}
              >
                Edit My Submission
              </button>

              <button
                type="button"
                onClick={newSubmission}
                className="rounded-2xl px-10 py-3.5 text-sm font-bold transition hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(10,31,20,0.15)",
                  color: "rgba(10,31,20,0.6)",
                  backgroundColor: "white",
                }}
              >
                Start New
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-10 lg:grid-cols-[260px_1fr]"
          >
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <span
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9A7A2E" }}
                >
                  Pre-Consultation
                </span>

                <h2
                  className="mb-8 font-light leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    color: "#0A1F14",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Skin{" "}
                  <strong
                    className="font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Anamnesis
                  </strong>
                </h2>

                <ol className="space-y-1">
                  {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isDone = currentStep > step.id;

                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(step.id)}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
                          style={{
                            backgroundColor: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                            border: isActive
                              ? "1px solid rgba(201,168,76,0.25)"
                              : "1px solid transparent",
                          }}
                        >
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                            style={{
                              backgroundColor: isActive
                                ? "#C9A84C"
                                : isDone
                                ? "rgba(201,168,76,0.2)"
                                : "rgba(10,31,20,0.07)",
                              color: isActive
                                ? "white"
                                : isDone
                                ? "#9A7A2E"
                                : "rgba(10,31,20,0.3)",
                            }}
                          >
                            {isDone ? "✓" : step.id}
                          </span>

                          <span
                            className="text-sm font-medium"
                            style={{
                              color: isActive
                                ? "#0A1F14"
                                : isDone
                                ? "rgba(10,31,20,0.6)"
                                : "rgba(10,31,20,0.35)",
                            }}
                          >
                            {step.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div
                  className="mt-8 h-1 overflow-hidden rounded-full"
                  style={{ backgroundColor: "rgba(10,31,20,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                      background: "linear-gradient(90deg, #C9A84C, #E8C96A)",
                    }}
                  />
                </div>

                <p className="mt-2 text-xs" style={{ color: "rgba(10,31,20,0.3)" }}>
                  Step {currentStep} of {STEPS.length}
                </p>
              </div>
            </aside>

            <div>
              <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 lg:hidden">
                {STEPS.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all"
                    style={{
                      backgroundColor:
                        currentStep === step.id
                          ? "#C9A84C"
                          : currentStep > step.id
                          ? "rgba(201,168,76,0.2)"
                          : "rgba(10,31,20,0.07)",
                      color:
                        currentStep === step.id
                          ? "white"
                          : currentStep > step.id
                          ? "#9A7A2E"
                          : "rgba(10,31,20,0.3)",
                    }}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </button>
                ))}
              </div>

              {submitMessage?.type === "error" && (
                <div
                  className="mb-5 rounded-xl px-5 py-4 text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(220,38,38,0.06)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    color: "#991b1b",
                  }}
                >
                  {submitMessage.text}
                </div>
              )}

              <div
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(201,168,76,0.2)",
                  boxShadow: "0 4px 24px rgba(10,31,20,0.06)",
                }}
              >
                <div
                  className="h-[3px]"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)",
                  }}
                />

                <div
                  className="px-8 py-6"
                  style={{
                    borderBottom: "1px solid rgba(10,31,20,0.06)",
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)",
                  }}
                >
                  <p
                    className="mb-1 text-xs font-bold uppercase tracking-[0.3em]"
                    style={{ color: "rgba(201,168,76,0.7)" }}
                  >
                    Step {currentStep} of {STEPS.length}
                  </p>

                  <h3
                    className="font-semibold"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      color: "#0A1F14",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {STEPS[currentStep - 1].label}
                  </h3>
                </div>

                <div className="space-y-6 p-8">
                  {currentStep === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <LightField label="Full Name" required error={errors.fullName?.message}>
                        <input {...register("fullName")} placeholder="Your full name" className={lightInputClass} />
                      </LightField>

                      <LightField label="Email Address" required error={errors.email?.message}>
                        <input {...register("email")} type="email" placeholder="your@email.com" className={lightInputClass} />
                      </LightField>

                      <LightField label="Age" error={errors.age?.message}>
                        <input {...register("age")} placeholder="e.g. 34" className={lightInputClass} />
                      </LightField>

                      <LightField label="Country / City" error={errors.location?.message}>
                        <input {...register("location")} placeholder="e.g. Stockholm, Sweden" className={lightInputClass} />
                      </LightField>

                      <LightField label="Ethnicity / Skin Ancestry" error={errors.ethnicity?.message}>
                        <select {...register("ethnicity")} className={lightInputClass}>
                          <option value="">Select...</option>
                          <option>Ethiopian</option>
                          <option>Eritrean</option>
                          <option>East African</option>
                          <option>West African</option>
                          <option>North African</option>
                          <option>Mixed ancestry</option>
                          <option>Other</option>
                        </select>
                      </LightField>

                      <LightField label="Fitzpatrick Skin Type" error={errors.fitzpatrickType?.message}>
                        <select {...register("fitzpatrickType")} className={lightInputClass}>
                          <option>Unknown / Not sure</option>
                          <option>Type I — Very fair, always burns</option>
                          <option>Type II — Fair, usually burns</option>
                          <option>Type III — Medium, sometimes burns</option>
                          <option>Type IV — Olive, rarely burns</option>
                          <option>Type V — Brown, very rarely burns</option>
                          <option>Type VI — Dark brown / black, never burns</option>
                        </select>
                      </LightField>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <LightField label="Main skin concern" required error={errors.mainConcern?.message}>
                        <textarea
                          {...register("mainConcern")}
                          rows={5}
                          placeholder="Describe what is bothering you most. When did it start? Where on your face/body? Has it changed over time?"
                          className={`${lightInputClass} resize-none`}
                        />
                      </LightField>

                      <div className="grid gap-5 md:grid-cols-2">
                        <LightField label="How long have you had this concern?" error={errors.concernDuration?.message}>
                          <select {...register("concernDuration")} className={lightInputClass}>
                            <option value="">Select...</option>
                            <option>Less than 3 months</option>
                            <option>3–6 months</option>
                            <option>6–12 months</option>
                            <option>1–2 years</option>
                            <option>3–5 years</option>
                            <option>More than 5 years</option>
                            <option>Since childhood</option>
                          </select>
                        </LightField>

                        <LightField label="Does it worsen in sun/summer?" error={errors.sunWorsens?.message}>
                          <select {...register("sunWorsens")} className={lightInputClass}>
                            <option value="">Select...</option>
                            <option>Yes, noticeably worse</option>
                            <option>Slightly worse</option>
                            <option>No difference</option>
                            <option>Improves in sun</option>
                            <option>Not sure</option>
                          </select>
                        </LightField>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(10,31,20,0.45)" }}>
                        Select all that apply to your skin history or current health context.
                      </p>

                      <div className="grid gap-2 md:grid-cols-2">
                        {triggerOptions.map((item) => {
                          const checked = selectedTriggers.includes(item);

                          return (
                            <label
                              key={item}
                              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-150"
                              style={{
                                backgroundColor: checked
                                  ? "rgba(201,168,76,0.08)"
                                  : "rgba(10,31,20,0.02)",
                                border: checked
                                  ? "1px solid rgba(201,168,76,0.35)"
                                  : "1px solid rgba(10,31,20,0.08)",
                                color: checked ? "#0A1F14" : "rgba(10,31,20,0.55)",
                                fontWeight: checked ? 600 : 400,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleTrigger(item)}
                                className="sr-only"
                              />

                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all"
                                style={{
                                  backgroundColor: checked ? "#C9A84C" : "transparent",
                                  border: checked
                                    ? "1.5px solid #C9A84C"
                                    : "1.5px solid rgba(10,31,20,0.2)",
                                }}
                              >
                                {checked && (
                                  <svg viewBox="0 0 12 10" className="h-3 w-3">
                                    <path
                                      d="M1 5l3.5 3.5L11 1"
                                      stroke="white"
                                      strokeWidth="1.8"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>

                              {item}
                            </label>
                          );
                        })}
                      </div>

                      <LightField label="Other triggers or relevant medical history" error={errors.medicalHistory?.message}>
                        <textarea
                          {...register("medicalHistory")}
                          rows={3}
                          placeholder="Medications, allergies, recent health changes, previous diagnoses, etc."
                          className={`${lightInputClass} resize-none`}
                        />
                      </LightField>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <LightField label="Morning routine" error={errors.morningRoutine?.message}>
                          <textarea
                            {...register("morningRoutine")}
                            rows={4}
                            placeholder="e.g. Cleanser → Vitamin C serum → Moisturiser → SPF 50"
                            className={`${lightInputClass} resize-none`}
                          />
                        </LightField>

                        <LightField label="Evening routine" error={errors.eveningRoutine?.message}>
                          <textarea
                            {...register("eveningRoutine")}
                            rows={4}
                            placeholder="e.g. Oil cleanser → Toner → Retinol → Moisturiser"
                            className={`${lightInputClass} resize-none`}
                          />
                        </LightField>
                      </div>

                      <LightField label="Treatments tried previously" error={errors.previousTreatments?.message}>
                        <textarea
                          {...register("previousTreatments")}
                          rows={3}
                          placeholder="What have you already tried? Did anything help or make it worse?"
                          className={`${lightInputClass} resize-none`}
                        />
                      </LightField>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-8">
                      <div
                        className="rounded-xl px-5 py-4"
                        style={{
                          backgroundColor: "rgba(201,168,76,0.06)",
                          border: "1px solid rgba(201,168,76,0.2)",
                        }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(10,31,20,0.6)" }}>
                          📌 Take photos in{" "}
                          <strong style={{ color: "#9A7A2E" }}>natural daylight</strong>, no flash, no makeup.
                          Reviewed personally by Brook before your session.
                        </p>
                      </div>

                      <div>
                        <p className="mb-4 text-sm font-semibold" style={{ color: "rgba(10,31,20,0.7)" }}>
                          Face photos — 3 angles
                        </p>

                        <div className="grid gap-4 md:grid-cols-3">
                          {photoSlots.map((slot) => (
                            <LightPhotoSlot
                              key={slot.key}
                              slotKey={slot.key}
                              title={slot.title}
                              subtitle={slot.subtitle}
                              icon={slot.icon}
                              photo={skinPhotos[slot.key]}
                              onUpload={handleSkinPhotoUpload}
                              onRemove={removeSkinPhoto}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold" style={{ color: "rgba(10,31,20,0.7)" }}>
                          Current skincare products
                        </p>

                        <p className="mb-4 text-sm" style={{ color: "rgba(10,31,20,0.4)" }}>
                          Upload photos of products you currently use. Brook will review ingredients for your skin type.
                        </p>

                        <label
                          htmlFor="productPhotos"
                          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-6 py-10 text-center transition-all hover:bg-black/[0.01]"
                          style={{
                            border: "2px dashed rgba(201,168,76,0.3)",
                            backgroundColor: "rgba(201,168,76,0.02)",
                          }}
                        >
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor: "rgba(201,168,76,0.1)",
                              border: "1px solid rgba(201,168,76,0.2)",
                            }}
                          >
                            <Upload size={20} strokeWidth={1.8} style={{ color: "#C9A84C" }} />
                          </div>

                          <p className="font-semibold" style={{ color: "#0A1F14" }}>
                            Drop product photos here
                          </p>

                          <p className="text-xs" style={{ color: "rgba(10,31,20,0.35)" }}>
                            or click to choose — up to 8 images
                          </p>

                          <input
                            id="productPhotos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleProductPhotosUpload}
                            className="hidden"
                          />
                        </label>

                        {productPhotos.length > 0 && (
                          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {productPhotos.map((photo, index) => (
                              <div
                                key={`${photo}-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-xl"
                                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
                              >
                                <img src={photo} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />

                                <button
                                  type="button"
                                  onClick={() => removeProductPhoto(index)}
                                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100"
                                  style={{
                                    backgroundColor: "rgba(10,31,20,0.85)",
                                    color: "white",
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-5">
                      <LightField label="What do you hope to achieve from this consultation?" required error={errors.goals?.message}>
                        <textarea
                          {...register("goals")}
                          rows={5}
                          placeholder="e.g. Understand my melasma type, get a personalised morning routine, know which ingredients to avoid..."
                          className={`${lightInputClass} resize-none`}
                        />
                      </LightField>

                      <div className="grid gap-5 md:grid-cols-2">
                        <LightField label="Monthly skincare budget" error={errors.budget?.message}>
                          <select {...register("budget")} className={lightInputClass}>
                            <option value="">Select...</option>
                            <option>Under $20/month</option>
                            <option>$20–$50/month</option>
                            <option>$50–$100/month</option>
                            <option>$100–$200/month</option>
                            <option>$200+/month</option>
                            <option>No fixed budget</option>
                          </select>
                        </LightField>

                        <LightField label="Preferred consultation language" error={errors.language?.message}>
                          <select {...register("language")} className={lightInputClass}>
                            <option>English</option>
                            <option>Amharic</option>
                            <option>Swedish</option>
                          </select>
                        </LightField>
                      </div>

                      <LightField label="Anything else Brook should know?" error={errors.extraNotes?.message}>
                        <textarea
                          {...register("extraNotes")}
                          rows={3}
                          placeholder="Anything important you want to share that hasn't been covered above."
                          className={`${lightInputClass} resize-none`}
                        />
                      </LightField>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center justify-between px-8 py-5"
                  style={{
                    borderTop: "1px solid rgba(10,31,20,0.06)",
                    backgroundColor: "rgba(10,31,20,0.01)",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:bg-black/5"
                    style={{
                      border: "1px solid rgba(10,31,20,0.12)",
                      color: "rgba(10,31,20,0.5)",
                    }}
                  >
                    ← Back
                  </button>

                  <div className="flex items-center gap-1.5">
                    {STEPS.map((step) => (
                      <span
                        key={step.id}
                        className="block rounded-full transition-all duration-300"
                        style={{
                          width: currentStep === step.id ? "1.5rem" : "0.5rem",
                          height: "0.5rem",
                          backgroundColor:
                            currentStep === step.id
                              ? "#C9A84C"
                              : currentStep > step.id
                              ? "rgba(201,168,76,0.4)"
                              : "rgba(10,31,20,0.12)",
                        }}
                      />
                    ))}
                  </div>

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                        color: "white",
                        boxShadow: "0 4px 16px rgba(201,168,76,0.25)",
                      }}
                    >
                      Continue <ChevronRight size={15} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-xl px-8 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Questionnaire →"}
                    </button>
                  )}
                </div>
              </div>

              <p
                className="mt-4 flex items-center gap-2 px-1 text-xs"
                style={{ color: "rgba(10,31,20,0.3)" }}
              >
                <Shield size={12} strokeWidth={2} />
                Your information is private and only seen by Brook. Saved securely to your client record.
              </p>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
      `}</style>
    </main>
  );
}

function LightField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-semibold"
        style={{ color: "rgba(10,31,20,0.7)" }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: "#C9A84C" }}>*</span>}
      </span>

      {children}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "#991b1b" }}>
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </label>
  );
}

function LightPhotoSlot({
  slotKey,
  title,
  subtitle,
  icon,
  photo,
  onUpload,
  onRemove,
}: {
  slotKey: string;
  title: string;
  subtitle: string;
  icon: string;
  photo?: string;
  onUpload: (slotKey: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (slotKey: string) => void;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        border: "1px solid rgba(201,168,76,0.2)",
        backgroundColor: "rgba(201,168,76,0.02)",
      }}
    >
      <input
        id={`skin-photo-${slotKey}`}
        type="file"
        accept="image/*"
        onChange={(event) => onUpload(slotKey, event)}
        className="hidden"
      />

      {photo ? (
        <>
          <img src={photo} alt={title} className="h-[220px] w-full object-cover" />

          <button
            type="button"
            onClick={() => onRemove(slotKey)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow"
            style={{
              backgroundColor: "rgba(10,31,20,0.85)",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "white",
            }}
          >
            <X size={15} />
          </button>

          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
            style={{
              background: "linear-gradient(to top, rgba(10,31,20,0.7), transparent)",
            }}
          >
            <p className="text-xs font-semibold" style={{ color: "#C9A84C" }}>
              {title}
            </p>
          </div>
        </>
      ) : (
        <label
          htmlFor={`skin-photo-${slotKey}`}
          className="flex h-[220px] cursor-pointer flex-col items-center justify-center text-center transition-all hover:bg-black/[0.02]"
        >
          <span className="text-3xl">{icon}</span>

          <span className="mt-3 text-sm font-semibold" style={{ color: "rgba(10,31,20,0.6)" }}>
            {title}
          </span>

          <span className="mt-1 text-xs" style={{ color: "rgba(10,31,20,0.3)" }}>
            {subtitle}
          </span>

          <span
            className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#9A7A2E",
            }}
          >
            <Camera size={13} />
            Upload photo
          </span>
        </label>
      )}
    </div>
  );
}

const lightInputClass =
  "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition duration-200 " +
  "bg-white border border-black/[0.09] text-[#0A1F14] " +
  "placeholder:text-black/25 " +
  "focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 " +
  "[&>option]:bg-white [&>option]:text-[#0A1F14]";