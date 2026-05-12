"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  HeartPulse,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { contactSchema, ContactFormData } from "./contact.schema";
import { stats } from "./contact.data";
import InfoCard from "./infoCard";
import Toast from "./Toast";

export default function ContactFormSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      concern: "",
      message: "",
    },
  });

  const messageValue = watch("message") || "";

  const inputClass =
    "w-full rounded-2xl border border-[#C9A84C]/15 bg-white/[0.06] px-5 py-4 text-white placeholder:text-white/38 outline-none transition-all duration-300 focus:border-[#C9A84C]/70 focus:bg-white/[0.1] focus:ring-4 focus:ring-[#C9A84C]/10";

  const errorClass = "mt-2 flex items-center gap-1.5 text-sm text-red-400";

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setToast({
        type: "success",
        message: "We'll get back to you within 24 hours.",
        id: Date.now(),
      });

      reset();
      setTimeout(() => setToast(null), 4000);
    } catch {
      setToast({
        type: "error",
        message: "Something went wrong. Please try again.",
        id: Date.now(),
      });
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <>
      <section
        id="contact-form"
        className="relative overflow-hidden px-4 py-24 sm:px-6 md:px-8 lg:px-12"
        style={{ backgroundColor: "#F0F7F2" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 50% at 15% 45%, rgba(201,168,76,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 85% 30%, rgba(74,144,164,0.05) 0%, transparent 50%)
            `,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9A7A2E]">
                Your Message
              </p>

              <h2
                className="max-w-3xl font-light leading-[1.15] text-[#0A1F14]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                }}
              >
                Tell us what your skin{" "}
                <strong
                  className="font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  needs help with.
                </strong>
              </h2>

              <div className="mt-9 space-y-5">
                <InfoCard
                  icon={<ShieldCheck size={26} strokeWidth={1.8} />}
                  title="Secure & confidential"
                  text="Your message is treated privately and only used to understand your skin concern."
                />

                <InfoCard
                  icon={<HeartPulse size={26} strokeWidth={1.8} />}
                  title="Personalised support"
                  text="Every reply is based on your skin history, routine, lifestyle and goals."
                />
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {stats.map(({ icon, value, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#071F14]/10 bg-white/70 p-4 text-center shadow-sm backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:bg-white"
                  >
                    <div className="mb-2 flex justify-center text-[#C9A84C]">
                      {icon}
                    </div>

                    <p
                      className="text-2xl font-semibold text-[#0A1F14]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {value}
                    </p>

                    <p className="text-xs text-[#343454]/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[2rem] border border-[#C9A84C]/25 bg-[#071F14] p-6 shadow-2xl shadow-[#071F14]/25 sm:p-8 md:p-10"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(28px)",
                transition: "all 850ms cubic-bezier(0.22,1,0.36,1) 160ms",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(201,168,76,0.18),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.08),transparent_30%)]" />
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="relative z-10 space-y-5"
              >
                <h2
                  className="mb-6 text-[2rem] font-semibold leading-tight text-white md:text-[2.6rem]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Send Us a <span className="text-[#C9A84C]">Message</span>
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <input
                      {...register("firstName")}
                      placeholder="First Name"
                      className={inputClass}
                    />

                    {errors.firstName && (
                      <p className={errorClass}>
                        <AlertCircle size={14} />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("lastName")}
                      placeholder="Last Name"
                      className={inputClass}
                    />

                    {errors.lastName && (
                      <p className={errorClass}>
                        <AlertCircle size={14} />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      className={inputClass}
                    />

                    {errors.email && (
                      <p className={errorClass}>
                        <AlertCircle size={14} />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="Phone (optional)"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell us a little about your skin and what you'd like help with..."
                    className={`${inputClass} resize-none`}
                  />

                  {errors.message && (
                    <p className={errorClass}>
                      <AlertCircle size={14} />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <p
                  className="text-right text-xs transition-colors duration-300"
                  style={{
                    color:
                      messageValue.length > 450
                        ? "#ef4444"
                        : messageValue.length > 350
                        ? "#C9A84C"
                        : "rgba(255,255,255,0.28)",
                  }}
                >
                  {messageValue.length} / 500
                </p>

                <button
                  disabled={isSubmitting}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 font-semibold text-[#071F14] shadow-lg shadow-[#C9A84C]/20 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(201,168,76,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(100deg, #C9A84C 0%, #E8C96A 40%, #C9A84C 60%, #E8C96A 100%)",
                    backgroundSize: "200% auto",
                    animation: isSubmitting
                      ? "none"
                      : "shimmer 3.5s linear infinite",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight size={20} strokeWidth={1.8} />
                    </>
                  )}
                </button>

                <p className="flex justify-center gap-2 text-center text-sm text-white/40">
                  <ShieldCheck size={16} strokeWidth={1.8} /> Secure &amp;
                  confidential
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {toast && <Toast toast={toast} />}
    </>
  );
}