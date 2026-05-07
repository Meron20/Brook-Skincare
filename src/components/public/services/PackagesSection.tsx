"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const packages = [
  {
    badge: "Most Popular",
    icon: "⭐",
    name: "Full Consultation",
    desc: "A complete personalised consultation — your melasma assessed, diagnosed, and treated with a full written protocol designed specifically for your skin.",
    price: "$30",
    priceSub: "45-minute video call",
    featured: true,
    features: [
      "45-minute WhatsApp / Zoom call",
      "Full skin analysis and diagnosis",
      "Morning + evening routine built for you",
      "Ingredient list — what to use and avoid",
      "Written treatment plan sent after",
      "Realistic 12-week timeline",
    ],
    cta: "Book Now",
  },
  {
    badge: "Complete Programme",
    icon: "🏆",
    name: "Full Programme",
    desc: "The most comprehensive option — a full consultation plus two follow-up sessions to monitor your progress, adjust your routine, and ensure real results.",
    price: "$50",
    priceSub: "Consultation + 2 follow-ups",
    featured: false,
    features: [
      "Everything in Full Consultation",
      "Follow-up session at week 4",
      "Follow-up session at week 8",
      "Routine adjustments as needed",
      "Progress photo analysis",
      "Priority WhatsApp support",
    ],
    cta: "Start Programme",
  },
];

export default function PackagesSection() {
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
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 30%, rgba(74,144,164,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* ── HEADER ── */}
        <div
          className="text-center mb-16"
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
            Consultation Packages
          </span>
          <h2
            className="font-light text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
              color: "#0A1F14",
            }}
          >
            Choose Your{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Package
            </strong>
          </h2>
          <p
            className="text-sm max-w-lg mx-auto"
            style={{ color: "rgba(10,31,20,0.55)", lineHeight: 1.8 }}
          >
            Honest, transparent pricing. Every consultation is personalised —
            not a generic plan copy-pasted for everyone.
          </p>
        </div>

        {/* ── PACKAGES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {packages.map((pkg, i) => (
            <div
            key={pkg.name}
            className="relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2"
            style={{
              background: pkg.featured
                ? "linear-gradient(135deg, #0A1F14, #1A3D2B)"
                : "linear-gradient(135deg, #0F2D1E, #0A1F14)",
              border: pkg.featured
                ? "1.5px solid rgba(201,168,76,0.5)"
                : "1px solid rgba(201,168,76,0.2)",
              boxShadow: pkg.featured
                ? "0 20px 60px rgba(10,31,20,0.25)"
                : "0 8px 30px rgba(10,31,20,0.15)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.8s ease ${i * 0.15}s`,
            }}
          >
              {/* Gold top line — featured only */}
              {pkg.featured && (
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, #C9A84C, #E8C96A, #C9A84C, transparent)",
                  }}
                />
              )}

              {/* Card body */}
              <div className="p-8 flex flex-col flex-1">

                {/* Badge */}
                <div className="mb-5">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: pkg.featured
                        ? "rgba(201,168,76,0.2)"
                        : "rgba(255,255,255,0.06)",
                      color: pkg.featured ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      border: pkg.featured
                        ? "1px solid rgba(201,168,76,0.3)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {pkg.badge}
                  </span>
                </div>

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{pkg.icon}</span>
                  <h3
                    className="font-semibold text-white"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "22px",
                    }}
                  >
                    {pkg.name}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {pkg.desc}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p
                    className="font-bold leading-none mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "48px",
                      color: pkg.featured ? "#C9A84C" : "white",
                    }}
                  >
                    {pkg.price}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {pkg.priceSub}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="mb-6"
                  style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {pkg.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: pkg.featured
                            ? "rgba(201,168,76,0.2)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <Check
                          size={11}
                          style={{ color: pkg.featured ? "#C9A84C" : "rgba(255,255,255,0.4)" }}
                        />
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: pkg.featured
                      ? "linear-gradient(135deg, #C9A84C, #9A7A2E)"
                      : "rgba(255,255,255,0.06)",
                    color: pkg.featured ? "#0A1F14" : "rgba(255,255,255,0.8)",
                    border: pkg.featured
                      ? "none"
                      : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: pkg.featured
                      ? "0 4px 20px rgba(201,168,76,0.35)"
                      : "none",
                  }}
                >
                  {pkg.cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          🔒 Secure booking · All sessions conducted online via video call · No hidden fees
        </p>
      </div>
    </section>
  );
}