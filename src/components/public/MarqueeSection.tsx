"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  "Hyperpigmentation",
  "Melasma",
  "Acne",
  "Blackheads",
  "Whiteheads",
  "Wrinkles",
  "Dark Spots",
  "Uneven Skin Tone",
  "Sun Damage",
  "Post-Inflammatory Marks",
  "Skin Brightening",
  "Anti-Aging",
  "Oily Skin",
  "Dry Skin",
  "Sensitive Skin",
  "Skin Barrier Repair",
];

// Dot separator between items
const Separator = () => (
  <span
    className="mx-4 flex-shrink-0"
    style={{ color: "#C9A84C", fontSize: "18px" }}
  >
    ✦
  </span>
);

export default function MarqueeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Duplicate items to create seamless loop
  const items = [...services, ...services, ...services];

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden py-5 my-10"
      style={{
        backgroundColor: "#0F2D1E",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #0F2D1E, transparent)",
        }}
      />

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #0F2D1E, transparent)",
        }}
      />

      {/* ── ROW 1 — moves left ── */}
      <div className="flex items-center mb-3">
        <div
          className="flex items-center flex-shrink-0"
          style={{ animation: "marquee-left 35s linear infinite" }}
        >
          {/* Our Services label */}
          <span
            className="flex-shrink-0 font-semibold uppercase tracking-widest mr-4 px-4 py-1.5 rounded-full"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "11px",
              color: "#0A1F14",
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              letterSpacing: "2px",
            }}
          >
            Our Services
          </span>
          <Separator />

          {items.map((service, i) => (
            <span key={i} className="flex items-center flex-shrink-0">
              <span
                className="flex-shrink-0 font-medium"
                style={{
                  fontSize: "13px",
                  color: i % 3 === 0
                    ? "#C9A84C"
                    : i % 3 === 1
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                {service}
              </span>
              <Separator />
            </span>
          ))}
        </div>
      </div>

      {/* ── ROW 2 — moves right (opposite direction) ── */}
      <div className="flex items-center overflow-hidden">
        <div
          className="flex items-center flex-shrink-0"
          style={{ animation: "marquee-right 28s linear infinite" }}
        >
          {/* Our Services label */}
          <span
            className="flex-shrink-0 font-semibold uppercase tracking-widest mr-4 px-4 py-1.5 rounded-full"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "11px",
              color: "#0A1F14",
              background: "linear-gradient(135deg, #9A7A2E, #C9A84C)",
              letterSpacing: "2px",
            }}
          >
            Skin Concerns
          </span>
          <Separator />

          {[...items].reverse().map((service, i) => (
            <span key={i} className="flex items-center flex-shrink-0">
              <span
                className="flex-shrink-0 font-medium"
                style={{
                  fontSize: "13px",
                  color: i % 3 === 0
                    ? "rgba(255,255,255,0.8)"
                    : i % 3 === 1
                    ? "#C9A84C"
                    : "rgba(255,255,255,0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                {service}
              </span>
              <Separator />
            </span>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}