"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Browse & Choose",
    desc: "Explore our services and find the consultation that matches your skin concern and goals.",
  },
  {
    num: "02",
    icon: "👤",
    title: "Create Account",
    desc: "Sign up in 30 seconds. Your account keeps your consultation history and journal notes safe.",
  },
  {
    num: "03",
    icon: "📅",
    title: "Pick a Time Slot",
    desc: "Choose a date and time that works for you from our available slots. All sessions are online.",
  },
  {
    num: "04",
    icon: "📋",
    title: "Fill Medical Form",
    desc: "Share details about your skin concerns, current routine and medical history for a tailored consultation.",
  },
  {
    num: "05",
    icon: "🎥",
    title: "Attend Consultation",
    desc: "Join your video call with Brook. Receive a personalised skincare plan and ongoing journal support.",
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* Background — from HTML */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 10% 50%, rgba(74,144,164,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── HEADER ── */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ color: "#C9A84C" }}
          >
            Simple Process
          </span>
          <h2
            className="font-light text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            How It{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Works
            </strong>
          </h2>
          <p
            className="text-base max-w-xl"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
          >
            From choosing your service to your first consultation — a clear,
            simple five-step journey designed for you.
          </p>
        </div>

        {/* ── STEPS GRID — card style from HTML ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 overflow-hidden cursor-default"
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: hoveredStep === i
                  ? "1px solid rgba(201,168,76,0.4)"
                  : "1px solid rgba(201,168,76,0.15)",
                transform: hoveredStep === i
                  ? "translateY(-6px)"
                  : "translateY(0)",
                transition: "all 0.3s ease",
                opacity: isVisible ? 1 : 0,
                transitionDelay: isVisible ? `${i * 0.1}s` : "0s",
              }}
            >
              {/* Gradient overlay on hover */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.05), transparent)",
                  opacity: hoveredStep === i ? 1 : 0,
                }}
              />

              {/* Step number — large faded */}
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "48px",
                  fontWeight: 300,
                  color: "rgba(201,168,76,0.2)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <span
                style={{
                  fontSize: "28px",
                  marginBottom: "14px",
                  display: "block",
                }}
              >
                {step.icon}
              </span>

              {/* Title */}
              <p
                className="font-semibold text-white mb-2"
                style={{ fontSize: "15px" }}
              >
                {step.title}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {step.desc}
              </p>

              {/* Connector arrow — between cards, not on last */}
              {i < steps.length - 1 && (
                <div
                  className="absolute hidden lg:block"
                  style={{
                    top: "50%",
                    right: "-10px",
                    width: "20px",
                    height: "2px",
                    background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)",
                    zIndex: 2,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}