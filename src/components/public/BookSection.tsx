"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  {
    icon: "🌍",
    title: "Available in Amharic — First Ever",
    desc: "The world's first clinical skincare book about melasma written in the Amharic language. Finally, accessible to every Ethiopian reader.",
  },
  {
    icon: "🔬",
    title: "18 Chapters of Science Made Simple",
    desc: "Skin anatomy, melanocyte biology, the complete ingredient guide, 12-week plans, and professional treatment options — explained simply.",
  },
  {
    icon: "💊",
    title: "The Brook 5-Pillar Method",
    desc: "Protect. Repair. Calm. Treat. Maintain. The complete framework for managing melasma long-term — developed through 8 years of clinical practice.",
  },
];

export default function BookSection() {
  const [isVisible, setIsVisible] = useState(false);
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
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "#D8EFE0" }}
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 10% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 30%, rgba(10,31,20,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ── LEFT — Book Cover ── */}
          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease",
            }}
          >
            <div className="relative">

              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 z-20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "#0A1F14",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
                }}
              >
                Now Available
              </div>

              {/* Book cover card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0F2D1E, #0A1F14)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  padding: "48px 40px",
                  textAlign: "center",
                  boxShadow: "0 20px 80px rgba(0,0,0,0.25)",
                  minWidth: "300px",
                }}
              >
                {/* Gold top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-[4px]"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)",
                  }}
                />

                {/* Book image */}
                <div className="relative w-48 h-64 mx-auto mb-6">
                  <Image
                    src="/brook-book.jpeg"
                    alt="Brook Skincare Book"
                    fill
                    className="object-cover rounded-xl"
                    style={{
                      boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  />
                </div>

                {/* Book title */}
                <p
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "22px",
                    color: "white",
                    lineHeight: 1.3,
                  }}
                >
                  The Complete Melasma Guide
                </p>

                {/* Language badge */}
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{
                    backgroundColor: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    color: "#C9A84C",
                  }}
                >
                  Available in English & Amharic
                </div>

                {/* Stats row */}
                <div
                  className="grid grid-cols-3 gap-4 pt-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {[
                    { value: "18", label: "Chapters" },
                    { value: "2", label: "Languages" },
                    { value: "5", label: "Pillars" },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <p
                        className="font-bold"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "24px",
                          color: "#C9A84C",
                        }}
                      >
                        {value}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative floating card */}
              <div
                className="absolute -bottom-6 -left-6 px-4 py-3 rounded-2xl hidden sm:block"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "#0A1F14" }}
                    >
                      First in Amharic
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(10,31,20,0.5)" }}
                    >
                      Written by Brook
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Book Info ── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            {/* Tag */}
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: "#9A7A2E" }}
            >
              The Book
            </span>

            {/* Title */}
            <h2
              className="font-light mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1.15,
                color: "#0A1F14",
              }}
            >
              The Melasma Guide{" "}
              <strong
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Nobody Else Has Written
              </strong>
            </h2>

            {/* Desc */}
            <p
              className="text-base mb-8"
              style={{
                color: "rgba(10,31,20,0.6)",
                lineHeight: 1.8,
              }}
            >
              Written in plain language for people with no medical background.
              The only clinical melasma guide in the world available in both
              English and Amharic.
            </p>

            {/* Features */}
            <div className="flex flex-col gap-5 mb-10">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "#0A1F14", fontSize: "15px" }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(10,31,20,0.55)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "#0A1F14",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                }}
              >
                📚 Get the Book
                <ArrowRight size={16} />
              </Link>

              <Link
                href="#"
                className="flex items-center gap-2 px-7 py-4 rounded-full font-medium text-sm transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(10,31,20,0.08)",
                  color: "#0A1F14",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                🇪🇹 Amharic Edition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}