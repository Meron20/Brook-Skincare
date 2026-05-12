"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Folder,
  Loader2,
  Plus,
  Save,
  Search,
  Shield,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import {
  clientJournalDefaultValues,
  clientJournalSchema,
  ClientJournalFormData,
} from "./clientJournal.schema";

// ─── Types ─────────────────────────────────────────────────────────────────

type ActiveTab = "form" | "records";

type ClientStatus = "new" | "reviewed" | "active" | "completed";
type EntryStatus = "new" | "in-progress" | "completed";

type DiagnosisEntry = {
  id: string;
  createdAt: string;
  sessionType: string;
  sessionTitle?: string;
  diagnosis: string;
  treatmentPlan: string;
  privateNotes?: string;
  status: EntryStatus;
  progressPhotos?: string[];
};

type ClientRecord = {
  id: string;
  fullName: string;
  email: string;
  submittedAt: string;
  status: ClientStatus;
  age?: string;
  location?: string;
  ethnicity?: string;
  fitzpatrickType?: string;
  mainConcern?: string;
  concernDuration?: string;
  sunWorsens?: string;
  triggers?: string[];
  medicalHistory?: string;
  morningRoutine?: string;
  eveningRoutine?: string;
  previousTreatments?: string;
  goals?: string;
  budget?: string;
  language?: string;
  extraNotes?: string;
  entries?: DiagnosisEntry[];
};

type NewEntryForm = {
  sessionType: string;
  sessionTitle: string;
  diagnosis: string;
  treatmentPlan: string;
  privateNotes: string;
  status: EntryStatus;
};

// ─── Constants ──────────────────────────────────────────────────────────────

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
  { key: "left",  title: "Left Profile", subtitle: "Turn slightly to the left", icon: "↩️" },
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

const SESSION_TYPES = [
  "Initial Consultation",
  "Follow-up — Week 4",
  "Follow-up — Week 8",
  "Follow-up — Week 12",
  "Progress Review",
  "Product Check-in",
  "Emergency / Reaction",
  "Final Review",
];

const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  new: "New", reviewed: "Reviewed", active: "Active", completed: "Completed",
};
const CLIENT_STATUS_COLOR: Record<ClientStatus, string> = {
  new: "rgba(201,168,76,0.9)",
  reviewed: "rgba(74,144,164,0.9)",
  active: "rgba(80,180,120,0.9)",
  completed: "rgba(255,255,255,0.3)",
};
const ENTRY_STATUS_COLOR: Record<EntryStatus, string> = {
  new: "rgba(201,168,76,0.9)",
  "in-progress": "rgba(74,144,164,0.9)",
  completed: "rgba(80,180,120,0.9)",
};

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ClientJournalPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("form");
  const [currentStep, setCurrentStep] = useState(1);
  const [skinPhotos, setSkinPhotos] = useState<Record<string, string>>({});
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Records state ────────────────────────────────────────────────────────
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingEntry, setSavingEntry] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState<NewEntryForm>({
    sessionType: "Initial Consultation",
    sessionTitle: "",
    diagnosis: "",
    treatmentPlan: "",
    privateNotes: "",
    status: "new",
  });

  // ── Animations ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3, vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18, o: Math.random() * 0.35 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.o})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // ── Load clients when tab opens ──────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "records" || clientsLoaded) return;
    setClientsLoading(true);
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data: ClientRecord[]) => { setClients(data); setClientsLoaded(true); })
      .catch(() => setClientsLoaded(true))
      .finally(() => setClientsLoading(false));
  }, [activeTab, clientsLoaded]);

  // ── Form ─────────────────────────────────────────────────────────────────
  const {
    register, handleSubmit, watch, setValue, trigger, reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientJournalFormData, unknown, ClientJournalFormData>({
    resolver: zodResolver(clientJournalSchema),
    defaultValues: clientJournalDefaultValues,
  });

  const selectedTriggers = watch("triggers") || [];

  const toggleTrigger = (value: string) => {
    setValue("triggers",
      selectedTriggers.includes(value)
        ? selectedTriggers.filter((i) => i !== value)
        : [...selectedTriggers, value],
      { shouldValidate: true });
  };

  const handleSkinPhotoUpload = (slotKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSkinPhotos((prev) => ({ ...prev, [slotKey]: URL.createObjectURL(file) }));
  };

  const handleProductPhotosUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProductPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8));
  };

  const removeProductPhoto = (index: number) => setProductPhotos((prev) => prev.filter((_, i) => i !== index));
  const removeSkinPhoto = (slotKey: string) => setSkinPhotos((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });

  const goNext = async () => {
    let fields: (keyof ClientJournalFormData)[] = [];
    if (currentStep === 1) fields = ["fullName", "email"];
    if (currentStep === 2) fields = ["mainConcern"];
    if (currentStep === 6) fields = ["goals", "language"];
    const valid = fields.length > 0 ? await trigger(fields) : true;
    if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: ClientJournalFormData) => {
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/consultation-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, skinPhotos: Object.values(skinPhotos), productPhotos }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed.");
      setSubmitMessage({ type: "success", text: "Questionnaire submitted successfully." });
    } catch (error) {
      console.error(error);
      setSubmitMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
  };

  const editSubmission = () => { setSubmitMessage(null); setActiveTab("form"); };
  const newSubmission = () => {
    reset(); setSkinPhotos({}); setProductPhotos([]);
    setCurrentStep(1); setActiveTab("form"); setSubmitMessage(null);
  };

  // ── Records handlers ─────────────────────────────────────────────────────
  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );
  const selectedClient = clients.find((c) => c.id === selectedId) ?? null;

  const handleSaveEntry = async () => {
    if (!selectedClient) return;
    if (!newEntry.diagnosis.trim() || !newEntry.treatmentPlan.trim()) {
      setSaveMsg({ type: "err", text: "Diagnosis and treatment plan are required." });
      return;
    }
    setSavingEntry(true); setSaveMsg(null);
    try {
      const res = await fetch(`/api/clients/${selectedClient.id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEntry, progressPhotos }),
      });
      if (!res.ok) throw new Error();
      const entry: DiagnosisEntry = await res.json();
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id
            ? { ...c, entries: [...(c.entries ?? []), entry], status: "reviewed" }
            : c
        )
      );
      setNewEntry({ sessionType: "Initial Consultation", sessionTitle: "", diagnosis: "", treatmentPlan: "", privateNotes: "", status: "new" });
      setProgressPhotos([]);
      setSaveMsg({ type: "ok", text: "Entry saved successfully." });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg({ type: "err", text: "Failed to save. Please try again." });
    } finally {
      setSavingEntry(false);
    }
  };

  const handleProgressPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProgressPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 6));
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#0A1F14" }}>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div style={{ position: "absolute", inset: 0, background: `
          radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(74,144,164,0.05) 0%, transparent 50%),
          radial-gradient(ellipse 60% 80% at 80% 10%, rgba(201,168,76,0.04) 0%, transparent 50%)` }} />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 hidden lg:block">
        {[600, 400, 200].map((size, i) => (
          <div key={size} className="absolute rounded-full" style={{
            width: `${size}px`, height: `${size}px`,
            top: `${-100 + i * 50}px`, right: `${-100 + i * 50}px`,
            border: "1px solid rgba(201,168,76,0.10)",
            animation: "pulse-ring 4s ease-in-out infinite", animationDelay: `${i * 0.6}s`,
            backgroundColor: i === 2 ? "rgba(201,168,76,0.015)" : "transparent",
          }} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")` }} />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.6 }} />

      <div className="relative z-10">
        {/* ── SUCCESS SCREEN ── */}
        {submitMessage?.type === "success" ? (
          <section className="flex min-h-screen items-center justify-center px-6 text-center" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="mx-auto max-w-3xl">
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #6EE7A8, #34D399)", boxShadow: "0 12px 34px rgba(52,211,153,0.25)" }}>
                <span className="text-5xl leading-none text-white">✓</span>
              </div>
              <h1 className="mb-4 font-semibold leading-tight text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}>
                Questionnaire Submitted Successfully
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-sm leading-6" style={{ color: "rgba(255,255,255,0.58)" }}>
                Thank you! Brook will review your answers and photos before your session. You'll hear back within 24 hours via WhatsApp or email.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button type="button" onClick={editSubmission} className="rounded-full px-10 py-4 text-sm font-bold transition hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A1F14", boxShadow: "0 8px 28px rgba(201,168,76,0.25)" }}>Edit My Submission</button>
                <button type="button" onClick={newSubmission} className="rounded-full px-10 py-4 text-sm font-bold transition hover:-translate-y-0.5" style={{ border: "1px solid rgba(201,168,76,0.22)", color: "rgba(255,255,255,0.72)", backgroundColor: "rgba(255,255,255,0.04)" }}>Start New</button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* ── NAV ── */}
            <nav className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: "rgba(10,31,20,0.85)", borderColor: "rgba(201,168,76,0.15)" }}>
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                    <Sparkles size={16} strokeWidth={1.8} style={{ color: "#C9A84C" }} />
                  </div>
                  <span className="font-semibold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.35rem", color: "white" }}>Brook Skin</span>
                </div>
                <div className="hidden items-center gap-1 rounded-full p-1 sm:flex" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <NavTab active={activeTab === "form"} onClick={() => setActiveTab("form")}><ClipboardList size={14} strokeWidth={2} /> Questionnaire</NavTab>
                  <NavTab active={activeTab === "records"} onClick={() => setActiveTab("records")}><Folder size={14} strokeWidth={2} /> Client Records</NavTab>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <Shield size={13} strokeWidth={2} /><span>Encrypted & Private</span>
                </div>
              </div>
            </nav>

            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}>

              {activeTab === "form" ? (
                /* ══════════════════════════════════════════════
                   FORM TAB
                ══════════════════════════════════════════════ */
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10 lg:grid-cols-[260px_1fr]">
                  {/* Sidebar */}
                  <aside className="hidden lg:block">
                    <div className="sticky top-28">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#C9A84C" }}>Pre-Consultation</p>
                      <h2 className="mb-8 font-semibold leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "white", letterSpacing: "-0.02em" }}>Skin Anamnesis</h2>
                      <ol className="space-y-1">
                        {STEPS.map((step) => {
                          const isActive = currentStep === step.id;
                          const isDone = currentStep > step.id;
                          return (
                            <li key={step.id}>
                              <button type="button" onClick={() => setCurrentStep(step.id)} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200" style={{ backgroundColor: isActive ? "rgba(201,168,76,0.12)" : "transparent", border: isActive ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent" }}>
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ backgroundColor: isActive ? "#C9A84C" : isDone ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)", color: isActive ? "#0A1F14" : isDone ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>{isDone ? "✓" : step.id}</span>
                                <span className="text-sm font-medium" style={{ color: isActive ? "white" : isDone ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)" }}>{step.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                      <div className="mt-8 h-1 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, background: "linear-gradient(90deg, #C9A84C, #E8C96A)" }} />
                      </div>
                      <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Step {currentStep} of {STEPS.length}</p>
                    </div>
                  </aside>

                  {/* Form panel */}
                  <div>
                    {/* Mobile dots */}
                    <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 lg:hidden">
                      {STEPS.map((step) => (
                        <button key={step.id} type="button" onClick={() => setCurrentStep(step.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all" style={{ backgroundColor: currentStep === step.id ? "#C9A84C" : currentStep > step.id ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.08)", color: currentStep === step.id ? "#0A1F14" : currentStep > step.id ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>{currentStep > step.id ? "✓" : step.id}</button>
                      ))}
                    </div>

                    {submitMessage?.type === "error" && (
                      <div className="mb-5 rounded-xl px-5 py-4 text-sm font-medium" style={{ backgroundColor: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.28)", color: "#fca5a5" }}>{submitMessage.text}</div>
                    )}

                    <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.18)", backdropFilter: "blur(12px)", boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.05)" }}>
                      <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }} />
                      <div className="px-8 py-7" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)" }}>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "rgba(201,168,76,0.55)" }}>Step {currentStep} of {STEPS.length}</p>
                        <h3 className="font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", color: "white", letterSpacing: "-0.01em" }}>{STEPS[currentStep - 1].label}</h3>
                      </div>

                      <div className="space-y-6 p-8">
                        {/* STEP 1 */}
                        {currentStep === 1 && (
                          <div className="grid gap-5 md:grid-cols-2">
                            <DarkField label="Full Name" required error={errors.fullName?.message}><input {...register("fullName")} placeholder="Your full name" className={darkInputClass} /></DarkField>
                            <DarkField label="Email Address" required error={errors.email?.message}><input {...register("email")} type="email" placeholder="your@email.com" className={darkInputClass} /></DarkField>
                            <DarkField label="Age" error={errors.age?.message}><input {...register("age")} placeholder="e.g. 34" className={darkInputClass} /></DarkField>
                            <DarkField label="Country / City" error={errors.location?.message}><input {...register("location")} placeholder="e.g. Stockholm, Sweden" className={darkInputClass} /></DarkField>
                            <DarkField label="Ethnicity / Skin Ancestry" error={errors.ethnicity?.message}>
                              <select {...register("ethnicity")} className={darkInputClass}>
                                <option value="">Select...</option>
                                <option>Ethiopian</option><option>Eritrean</option><option>East African</option>
                                <option>West African</option><option>North African</option>
                                <option>Mixed ancestry</option><option>Other</option>
                              </select>
                            </DarkField>
                            <DarkField label="Fitzpatrick Skin Type" error={errors.fitzpatrickType?.message}>
                              <select {...register("fitzpatrickType")} className={darkInputClass}>
                                <option>Unknown / Not sure</option>
                                <option>Type I — Very fair, always burns</option>
                                <option>Type II — Fair, usually burns</option>
                                <option>Type III — Medium, sometimes burns</option>
                                <option>Type IV — Olive, rarely burns</option>
                                <option>Type V — Brown, very rarely burns</option>
                                <option>Type VI — Dark brown / black, never burns</option>
                              </select>
                            </DarkField>
                          </div>
                        )}

                        {/* STEP 2 */}
                        {currentStep === 2 && (
                          <div className="space-y-5">
                            <DarkField label="Main skin concern" required error={errors.mainConcern?.message}>
                              <textarea {...register("mainConcern")} rows={5} placeholder="Describe what is bothering you most. When did it start? Where on your face/body? Has it changed over time?" className={`${darkInputClass} resize-none`} />
                            </DarkField>
                            <div className="grid gap-5 md:grid-cols-2">
                              <DarkField label="How long have you had this concern?" error={errors.concernDuration?.message}>
                                <select {...register("concernDuration")} className={darkInputClass}>
                                  <option value="">Select...</option>
                                  <option>Less than 3 months</option><option>3–6 months</option>
                                  <option>6–12 months</option><option>1–2 years</option>
                                  <option>3–5 years</option><option>More than 5 years</option><option>Since childhood</option>
                                </select>
                              </DarkField>
                              <DarkField label="Does it worsen in sun/summer?" error={errors.sunWorsens?.message}>
                                <select {...register("sunWorsens")} className={darkInputClass}>
                                  <option value="">Select...</option>
                                  <option>Yes, noticeably worse</option><option>Slightly worse</option>
                                  <option>No difference</option><option>Improves in sun</option><option>Not sure</option>
                                </select>
                              </DarkField>
                            </div>
                          </div>
                        )}

                        {/* STEP 3 */}
                        {currentStep === 3 && (
                          <div className="space-y-6">
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>Select all that apply to your skin history or current health context.</p>
                            <div className="grid gap-2 md:grid-cols-2">
                              {triggerOptions.map((item) => {
                                const checked = selectedTriggers.includes(item);
                                return (
                                  <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-150" style={{ backgroundColor: checked ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", border: checked ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.07)", color: checked ? "white" : "rgba(255,255,255,0.5)", fontWeight: checked ? 600 : 400 }}>
                                    <input type="checkbox" checked={checked} onChange={() => toggleTrigger(item)} className="sr-only" />
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all" style={{ backgroundColor: checked ? "#C9A84C" : "transparent", border: checked ? "1.5px solid #C9A84C" : "1.5px solid rgba(255,255,255,0.2)" }}>
                                      {checked && <svg viewBox="0 0 12 10" className="h-3 w-3"><path d="M1 5l3.5 3.5L11 1" stroke="#0A1F14" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </span>
                                    {item}
                                  </label>
                                );
                              })}
                            </div>
                            <DarkField label="Other triggers or relevant medical history" error={errors.medicalHistory?.message}>
                              <textarea {...register("medicalHistory")} rows={3} placeholder="Medications, allergies, recent health changes, previous diagnoses, etc." className={`${darkInputClass} resize-none`} />
                            </DarkField>
                          </div>
                        )}

                        {/* STEP 4 */}
                        {currentStep === 4 && (
                          <div className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                              <DarkField label="Morning routine" error={errors.morningRoutine?.message}><textarea {...register("morningRoutine")} rows={4} placeholder="e.g. Cleanser → Vitamin C serum → Moisturiser → SPF 50" className={`${darkInputClass} resize-none`} /></DarkField>
                              <DarkField label="Evening routine" error={errors.eveningRoutine?.message}><textarea {...register("eveningRoutine")} rows={4} placeholder="e.g. Oil cleanser → Toner → Retinol → Moisturiser" className={`${darkInputClass} resize-none`} /></DarkField>
                            </div>
                            <DarkField label="Treatments tried previously" error={errors.previousTreatments?.message}><textarea {...register("previousTreatments")} rows={3} placeholder="What have you already tried? Did anything help or make it worse?" className={`${darkInputClass} resize-none`} /></DarkField>
                          </div>
                        )}

                        {/* STEP 5 */}
                        {currentStep === 5 && (
                          <div className="space-y-8">
                            <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
                              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>📌 Take photos in <strong style={{ color: "#C9A84C" }}>natural daylight</strong>, no flash, no makeup. Reviewed personally by Brook before your session.</p>
                            </div>
                            <div>
                              <p className="mb-4 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>Face photos — 3 angles</p>
                              <div className="grid gap-4 md:grid-cols-3">
                                {photoSlots.map((slot) => (<DarkPhotoSlot key={slot.key} slotKey={slot.key} title={slot.title} subtitle={slot.subtitle} icon={slot.icon} photo={skinPhotos[slot.key]} onUpload={handleSkinPhotoUpload} onRemove={removeSkinPhoto} />))}
                              </div>
                            </div>
                            <div>
                              <p className="mb-2 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>Current skincare products</p>
                              <p className="mb-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Upload photos of products you currently use. Brook will review ingredients for your skin type.</p>
                              <label htmlFor="productPhotos" className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-6 py-10 text-center transition-all" style={{ border: "2px dashed rgba(201,168,76,0.25)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}><Upload size={20} strokeWidth={1.8} style={{ color: "#C9A84C" }} /></div>
                                <p className="font-semibold" style={{ color: "white" }}>Drop product photos here</p>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>or click to choose — up to 8 images</p>
                                <input id="productPhotos" type="file" multiple accept="image/*" onChange={handleProductPhotosUpload} className="hidden" />
                              </label>
                              {productPhotos.length > 0 && (
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                  {productPhotos.map((photo, index) => (
                                    <div key={`${photo}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                                      <img src={photo} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                                      <button type="button" onClick={() => removeProductPhoto(index)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-white opacity-0 transition group-hover:opacity-100" style={{ backgroundColor: "rgba(10,31,20,0.9)" }}><X size={14} /></button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* STEP 6 */}
                        {currentStep === 6 && (
                          <div className="space-y-5">
                            <DarkField label="What do you hope to achieve from this consultation?" required error={errors.goals?.message}>
                              <textarea {...register("goals")} rows={5} placeholder="e.g. Understand my melasma type, get a personalised morning routine, know which ingredients to avoid..." className={`${darkInputClass} resize-none`} />
                            </DarkField>
                            <div className="grid gap-5 md:grid-cols-2">
                              <DarkField label="Monthly skincare budget" error={errors.budget?.message}>
                                <select {...register("budget")} className={darkInputClass}>
                                  <option value="">Select...</option>
                                  <option>Under $20/month</option><option>$20–$50/month</option>
                                  <option>$50–$100/month</option><option>$100–$200/month</option>
                                  <option>$200+/month</option><option>No fixed budget</option>
                                </select>
                              </DarkField>
                              <DarkField label="Preferred consultation language" error={errors.language?.message}>
                                <select {...register("language")} className={darkInputClass}>
                                  <option>English</option><option>Amharic</option><option>Swedish</option>
                                </select>
                              </DarkField>
                            </div>
                            <DarkField label="Anything else Brook should know?" error={errors.extraNotes?.message}>
                              <textarea {...register("extraNotes")} rows={3} placeholder="Anything important you want to share that hasn't been covered above." className={`${darkInputClass} resize-none`} />
                            </DarkField>
                          </div>
                        )}
                      </div>

                      {/* Footer nav */}
                      <div className="flex items-center justify-between px-8 py-5" style={{ borderTop: "1px solid rgba(201,168,76,0.1)", backgroundColor: "rgba(0,0,0,0.15)" }}>
                        <button type="button" onClick={goPrev} disabled={currentStep === 1} className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:bg-white/5 disabled:pointer-events-none disabled:opacity-0" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>← Back</button>
                        <div className="flex items-center gap-1.5">
                          {STEPS.map((step) => (<span key={step.id} className="block rounded-full transition-all duration-300" style={{ width: currentStep === step.id ? "1.5rem" : "0.5rem", height: "0.5rem", backgroundColor: currentStep === step.id ? "#C9A84C" : currentStep > step.id ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.12)" }} />))}
                        </div>
                        {currentStep < STEPS.length ? (
                          <button type="button" onClick={goNext} className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A1F14", boxShadow: "0 4px 16px rgba(201,168,76,0.25)" }}>Continue <ChevronRight size={15} strokeWidth={2.5} /></button>
                        ) : (
                          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl px-8 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A1F14", boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}>{isSubmitting ? "Submitting..." : "Submit Questionnaire →"}</button>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 flex items-center gap-2 px-1 text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                      <Shield size={12} strokeWidth={2} /> Your information is private and only seen by Brook. Saved securely to your client record.
                    </p>
                  </div>
                </form>

              ) : (
                /* ══════════════════════════════════════════════
                   RECORDS TAB
                ══════════════════════════════════════════════ */
                <div>
                  {/* Expert banner */}
                  <div className="mb-6 flex items-center gap-3 rounded-xl px-5 py-4 text-sm" style={{ backgroundColor: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}>
                    <Shield size={15} strokeWidth={2} />
                    <span><strong>Expert Access:</strong> This panel is for Brook only — view client histories, write diagnoses, and manage treatment plans.</span>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
                    {/* ── CLIENT LIST ── */}
                    <aside className="flex flex-col gap-4 rounded-2xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)", alignSelf: "start", position: "sticky", top: "88px" }}>
                      <h3 className="font-semibold" style={{ color: "white" }}>
                        Clients
                        {clients.length > 0 && <span className="ml-2 rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>{clients.length}</span>}
                      </h3>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                      </div>
                      <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                        {clientsLoading ? (
                          <div className="flex items-center justify-center py-10"><Loader2 size={20} className="animate-spin" style={{ color: "#C9A84C" }} /></div>
                        ) : filteredClients.length === 0 ? (
                          <p className="py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.28)" }}>
                            {search ? "No clients match your search." : "No clients yet.\nSubmitted questionnaires will appear here."}
                          </p>
                        ) : filteredClients.map((client) => (
                          <button key={client.id} type="button" onClick={() => setSelectedId(client.id)} className="w-full rounded-xl px-4 py-3 text-left transition-all" style={{ backgroundColor: selectedId === client.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.02)", border: selectedId === client.id ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold" style={{ color: "white" }}>{client.fullName}</p>
                              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: CLIENT_STATUS_COLOR[client.status], color: "#0A1F14" }}>{CLIENT_STATUS_LABEL[client.status]}</span>
                            </div>
                            <p className="mt-0.5 truncate text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{client.email}</p>
                            <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                              {new Date(client.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* ── DETAIL PANEL ── */}
                    <div>
                      {!selectedClient ? (
                        <div className="flex min-h-[480px] items-center justify-center rounded-2xl p-10 text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", backdropFilter: "blur(10px)" }}>
                          <div>
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>📁</div>
                            <h3 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "white" }}>Select a Client</h3>
                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6" style={{ color: "rgba(255,255,255,0.3)" }}>Choose a client from the list to view their full intake form and add a diagnosis entry.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Client header card */}
                          <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.18)", backdropFilter: "blur(12px)" }}>
                            <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }} />
                            <div className="flex items-center justify-between px-7 py-6" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)" }}>
                              <div>
                                <h2 className="font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "white", letterSpacing: "-0.01em" }}>{selectedClient.fullName}</h2>
                                <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{selectedClient.email} · Client since {new Date(selectedClient.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide" style={{ backgroundColor: CLIENT_STATUS_COLOR[selectedClient.status], color: "#0A1F14" }}>{CLIENT_STATUS_LABEL[selectedClient.status]}</span>
                                <button type="button" onClick={() => window.open(`/api/clients/${selectedClient.id}/export`, "_blank")} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                                  <FileText size={13} strokeWidth={2} /> Export PDF
                                </button>
                              </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-px md:grid-cols-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                              {[
                                { label: "Age", value: selectedClient.age || "—" },
                                { label: "Location", value: selectedClient.location || "—" },
                                { label: "Ethnicity", value: selectedClient.ethnicity || "—" },
                                { label: "Fitzpatrick", value: selectedClient.fitzpatrickType || "—" },
                                { label: "Duration", value: selectedClient.concernDuration || "—" },
                                { label: "Language", value: selectedClient.language || "—" },
                              ].map(({ label, value }) => (
                                <div key={label} className="px-6 py-4" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>{label}</p>
                                  <p className="mt-1 text-sm font-medium" style={{ color: "white" }}>{value}</p>
                                </div>
                              ))}
                            </div>

                            {/* Concern, triggers, routines, goals */}
                            <div className="space-y-5 p-7">
                              {selectedClient.mainConcern && (
                                <div>
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Primary Concern</p>
                                  <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)" }}>{selectedClient.mainConcern}</p>
                                </div>
                              )}
                              {selectedClient.triggers && selectedClient.triggers.length > 0 && (
                                <div>
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Triggers Reported</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedClient.triggers.map((t) => (
                                      <span key={t} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>{t}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {(selectedClient.morningRoutine || selectedClient.eveningRoutine) && (
                                <div className="grid gap-4 md:grid-cols-2">
                                  {selectedClient.morningRoutine && (
                                    <div>
                                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Morning Routine</p>
                                      <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)" }}>{selectedClient.morningRoutine}</p>
                                    </div>
                                  )}
                                  {selectedClient.eveningRoutine && (
                                    <div>
                                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Evening Routine</p>
                                      <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)" }}>{selectedClient.eveningRoutine}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              {selectedClient.goals && (
                                <div>
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Client Goals</p>
                                  <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)" }}>{selectedClient.goals}</p>
                                </div>
                              )}
                              {selectedClient.previousTreatments && (
                                <div>
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Previous Treatments</p>
                                  <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)" }}>{selectedClient.previousTreatments}</p>
                                </div>
                              )}
                              {selectedClient.extraNotes && (
                                <div>
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>Extra Notes</p>
                                  <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}>{selectedClient.extraNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Past entries */}
                          {selectedClient.entries && selectedClient.entries.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "rgba(201,168,76,0.6)" }}>Past Entries ({selectedClient.entries.length})</p>
                              {selectedClient.entries.map((entry) => <EntryCard key={entry.id} entry={entry} entryStatusColor={ENTRY_STATUS_COLOR} />)}
                            </div>
                          )}

                          {/* New entry form */}
                          <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.18)", backdropFilter: "blur(12px)" }}>
                            <div className="flex items-center gap-3 px-7 py-5" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)" }}>
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}><Plus size={15} style={{ color: "#C9A84C" }} /></div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: "white" }}>Add New Entry</p>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Write diagnosis & treatment plan</p>
                              </div>
                            </div>

                            <div className="space-y-5 p-7">
                              <div className="grid gap-4 md:grid-cols-2">
                                <RecordField label="Session Type">
                                  <div className="relative">
                                    <select value={newEntry.sessionType} onChange={(e) => setNewEntry((p) => ({ ...p, sessionType: e.target.value }))} className={darkInputClass + " appearance-none pr-10"}>
                                      {SESSION_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                                  </div>
                                </RecordField>
                                <RecordField label="Session Title (optional)">
                                  <input value={newEntry.sessionTitle} onChange={(e) => setNewEntry((p) => ({ ...p, sessionTitle: e.target.value }))} placeholder="e.g. Week 4 Follow-up" className={darkInputClass} />
                                </RecordField>
                              </div>

                              <RecordField label="Diagnosis" required>
                                <textarea value={newEntry.diagnosis} onChange={(e) => setNewEntry((p) => ({ ...p, diagnosis: e.target.value }))} rows={5} placeholder="Full diagnosis — melasma type, Fitzpatrick confirmed, depth (epidermal/dermal/mixed), distribution pattern, contributing factors identified..." className={`${darkInputClass} resize-y`} />
                              </RecordField>

                              <RecordField label="Treatment Plan" required>
                                <textarea value={newEntry.treatmentPlan} onChange={(e) => setNewEntry((p) => ({ ...p, treatmentPlan: e.target.value }))} rows={5} placeholder="Recommended routine — morning and evening protocol, specific products and ingredients, what to avoid, SPF guidance, timeline, lifestyle changes..." className={`${darkInputClass} resize-y`} />
                              </RecordField>

                              <RecordField label="Private Notes">
                                <textarea value={newEntry.privateNotes} onChange={(e) => setNewEntry((p) => ({ ...p, privateNotes: e.target.value }))} rows={3} placeholder="Internal observations, red flags noticed, patient compliance notes, follow-up reminders..." className={`${darkInputClass} resize-y`} />
                              </RecordField>

                              <RecordField label="Progress / Follow-up Photos (optional)">
                                <label htmlFor="progressPhotos" className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-6 py-8 text-center transition-all" style={{ border: "2px dashed rgba(201,168,76,0.25)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}><Camera size={18} strokeWidth={1.8} style={{ color: "#C9A84C" }} /></div>
                                  <p className="text-sm font-semibold" style={{ color: "white" }}>Upload progress photos</p>
                                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>up to 6 images</p>
                                  <input id="progressPhotos" type="file" multiple accept="image/*" onChange={handleProgressPhoto} className="hidden" />
                                </label>
                                {progressPhotos.length > 0 && (
                                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    {progressPhotos.map((photo, i) => (
                                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                                        <img src={photo} alt="" className="h-full w-full object-cover" />
                                        <button type="button" onClick={() => setProgressPhotos((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full text-white opacity-0 transition group-hover:opacity-100" style={{ backgroundColor: "rgba(10,31,20,0.9)" }}><X size={12} /></button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </RecordField>
                            </div>

                            {/* Entry footer */}
                            <div className="flex items-center justify-between px-7 py-5" style={{ borderTop: "1px solid rgba(201,168,76,0.1)", backgroundColor: "rgba(0,0,0,0.15)" }}>
                              <div className="relative">
                                <select value={newEntry.status} onChange={(e) => setNewEntry((p) => ({ ...p, status: e.target.value as EntryStatus }))} className="appearance-none rounded-xl py-2.5 pl-4 pr-9 text-sm font-semibold outline-none transition" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                                  <option value="new">Status: New</option>
                                  <option value="in-progress">Status: In Progress</option>
                                  <option value="completed">Status: Completed</option>
                                </select>
                                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
                              </div>
                              <div className="flex items-center gap-3">
                                {saveMsg && (
                                  <p className="flex items-center gap-1.5 text-sm" style={{ color: saveMsg.type === "ok" ? "#6ee7a0" : "#f87171" }}>
                                    {saveMsg.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    {saveMsg.text}
                                  </p>
                                )}
                                <button type="button" onClick={handleSaveEntry} disabled={savingEntry} className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg, #C9A84C, #9A7A2E)", color: "#0A1F14", boxShadow: "0 4px 16px rgba(201,168,76,0.25)" }}>
                                  {savingEntry ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={2.2} />}
                                  {savingEntry ? "Saving..." : "Save Entry"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.015); }
        }
      `}</style>
    </main>
  );
}

// ─── Entry accordion card ─────────────────────────────────────────────────────

function EntryCard({ entry, entryStatusColor }: { entry: DiagnosisEntry; entryStatusColor: Record<EntryStatus, string> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-6 py-4 text-left transition-all hover:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}><FileText size={14} style={{ color: "#C9A84C" }} /></div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "white" }}>{entry.sessionTitle || entry.sessionType}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: entryStatusColor[entry.status], color: "#0A1F14" }}>{entry.status.replace("-", " ")}</span>
          <ChevronDown size={16} className="transition-transform duration-200" style={{ color: "rgba(255,255,255,0.3)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </button>
      {open && (
        <div className="space-y-4 px-6 pb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Diagnosis</p>
            <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}>{entry.diagnosis}</p>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Treatment Plan</p>
            <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}>{entry.treatmentPlan}</p>
          </div>
          {entry.privateNotes && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>Private Notes</p>
              <p className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }}>{entry.privateNotes}</p>
            </div>
          )}
          {entry.progressPhotos && entry.progressPhotos.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.6)" }}>Progress Photos</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {entry.progressPhotos.map((photo, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NavTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200" style={{ backgroundColor: active ? "#C9A84C" : "transparent", color: active ? "#0A1F14" : "rgba(255,255,255,0.45)", boxShadow: active ? "0 2px 12px rgba(201,168,76,0.3)" : "none" }}>
      {children}
    </button>
  );
}

function DarkField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
        {label}{required && <span className="ml-1" style={{ color: "#C9A84C" }}>*</span>}
      </span>
      {children}
      {error && <p className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "#f87171" }}><AlertCircle size={14} />{error}</p>}
    </label>
  );
}

function RecordField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(201,168,76,0.55)" }}>
        {label}{required && <span className="ml-1" style={{ color: "#C9A84C" }}>*</span>}
      </p>
      {children}
    </div>
  );
}

function DarkPhotoSlot({ slotKey, title, subtitle, icon, photo, onUpload, onRemove }: { slotKey: string; title: string; subtitle: string; icon: string; photo?: string; onUpload: (slotKey: string, event: React.ChangeEvent<HTMLInputElement>) => void; onRemove: (slotKey: string) => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(201,168,76,0.18)", backgroundColor: "rgba(255,255,255,0.02)" }}>
      <input id={`skin-photo-${slotKey}`} type="file" accept="image/*" onChange={(event) => onUpload(slotKey, event)} className="hidden" />
      {photo ? (
        <>
          <img src={photo} alt={title} className="h-[260px] w-full object-cover" />
          <button type="button" onClick={() => onRemove(slotKey)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white shadow" style={{ backgroundColor: "rgba(10,31,20,0.92)", border: "1px solid rgba(201,168,76,0.3)" }}><X size={15} /></button>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: "linear-gradient(to top, rgba(10,31,20,0.85), transparent)" }}>
            <p className="text-xs font-semibold" style={{ color: "#C9A84C" }}>{title}</p>
          </div>
        </>
      ) : (
        <label htmlFor={`skin-photo-${slotKey}`} className="flex h-[260px] cursor-pointer flex-col items-center justify-center text-center transition-all hover:bg-white/[0.02]">
          <span className="text-3xl">{icon}</span>
          <span className="mt-3 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{title}</span>
          <span className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>{subtitle}</span>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold" style={{ border: "1px solid rgba(201,168,76,0.28)", color: "#C9A84C" }}><Camera size={13} />Upload photo</span>
        </label>
      )}
    </div>
  );
}

const darkInputClass =
  "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition duration-200 " +
  "bg-white/[0.05] border border-white/[0.09] text-white " +
  "placeholder:text-white/20 " +
  "focus:border-[#C9A84C]/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#C9A84C]/10 " +
  "[&>option]:bg-[#0F2B1A] [&>option]:text-white";
