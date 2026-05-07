"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    num: "01",
    name: "Protect",
    emoji: "🛡️",
    color: "#C9A84C",
    desc: "Daily SPF protection is the foundation of all pigmentation treatment. Without it, nothing else works. Every other step is undermined without consistent sun protection.",
  },
  {
    num: "02",
    name: "Repair",
    emoji: "🔬",
    color: "#4A90A4",
    desc: "Targeted actives that repair the skin barrier and interrupt the melanin production cycle at its source. Rebuilding what has been damaged is essential before treating pigmentation.",
  },
  {
    num: "03",
    name: "Calm",
    emoji: "🌿",
    color: "#2E7D32",
    desc: "Anti-inflammatory ingredients to reduce triggers that stimulate excess pigment production. Inflammation is one of the leading causes of post-inflammatory hyperpigmentation.",
  },
  {
    num: "04",
    name: "Treat",
    emoji: "✨",
    color: "#C9A84C",
    desc: "Clinical-grade brightening ingredients applied correctly, in the right order, at the right concentration and time of day for maximum efficacy and minimum irritation.",
  },
  {
    num: "05",
    name: "Maintain",
    emoji: "📋",
    color: "#9A7A2E",
    desc: "Long-term consistency and routine adaptation to maintain results and prevent recurrence. Melasma is a chronic condition — maintenance is not optional, it is part of the cure.",
  },
];

const getNodePosition = (index: number, total: number, radius: number) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

export default function PillarsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCenterClick = () => {
    const next = (activePillar + 1) % pillars.length;
    setActivePillar(next);
    setRotation(prev => prev + 72);
  };

  const handleNodeClick = (i: number) => {
    setActivePillar(i);
    const steps = (i - activePillar + pillars.length) % pillars.length;
    setRotation(prev => prev + steps * 72);
  };

  const active = pillars[activePillar];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 15% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 30%, rgba(74,144,164,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── SECTION HEADER ── */}
        <div
          className="text-center mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ color: "#9A7A2E" }}
          >
            The Method
          </span>
          <h2
            className="font-light mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              color: "#0A1F14",
            }}
          >
            The Brook{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              5-Pillar Method
            </strong>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(10,31,20,0.55)", lineHeight: 1.7 }}
          >
            Developed through 8 years of clinical practice — a complete framework
            for managing hyperpigmentation long-term with real, lasting results.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ══════════════════════════
               LEFT — Orbit Circle
          ══════════════════════════ */}
          <div
            className="flex flex-col items-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            <div className="relative" style={{ width: "440px", height: "440px" }}>

              {/* Outer dashed ring — static */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1.5px dashed rgba(201,168,76,0.3)" }}
              />

              {/* Inner static ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "40px",
                  border: "1px solid rgba(10,31,20,0.06)",
                }}
              />

              {/* Rotating container — nodes + SVG lines */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* SVG connector lines */}
                <svg
                  className="absolute inset-0"
                  width="440"
                  height="440"
                  style={{ pointerEvents: "none" }}
                >
                  {pillars.map((_, i) => {
                    const pos = getNodePosition(i, pillars.length, 175);
                    const isActive = activePillar === i;
                    return (
                      <line
                        key={i}
                        x1="220" y1="220"
                        x2={220 + pos.x}
                        y2={220 + pos.y}
                        stroke={isActive
                          ? "rgba(201,168,76,0.5)"
                          : "rgba(10,31,20,0.1)"}
                        strokeWidth={isActive ? "1.5" : "1"}
                        strokeDasharray={isActive ? "none" : "4 4"}
                      />
                    );
                  })}
                </svg>

                {/* Pillar nodes */}
                {pillars.map((pillar, i) => {
                  const pos = getNodePosition(i, pillars.length, 175);
                  const isActive = activePillar === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleNodeClick(i)}
                      className="absolute flex flex-col items-center justify-center text-center transition-all duration-300"
                      style={{
                        width: "76px",
                        height: "76px",
                        top: "50%",
                        left: "50%",
                        // Counter-rotate so text stays upright
                        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${-rotation}deg)`,
                        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? "rgba(201,168,76,0.15)"
                          : "rgba(255,255,255,0.95)",
                        border: isActive
                          ? "2px solid #C9A84C"
                          : "1px solid rgba(201,168,76,0.35)",
                        boxShadow: isActive
                          ? "0 0 20px rgba(201,168,76,0.35), 0 4px 12px rgba(0,0,0,0.08)"
                          : "0 2px 8px rgba(0,0,0,0.06)",
                        backdropFilter: "blur(12px)",
                        cursor: "pointer",
                        zIndex: isActive ? 10 : 1,
                      }}
                    >
                      <span className="text-lg mb-0.5">{pillar.emoji}</span>
                      <span
                        className="font-semibold uppercase leading-tight"
                        style={{
                          fontSize: "8px",
                          color: isActive ? "#9A7A2E" : "#0A1F14",
                          letterSpacing: "0.8px",
                        }}
                      >
                        {pillar.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CENTER — Logo + click to rotate */}
              <button
                onClick={handleCenterClick}
                className="absolute rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  width: "130px",
                  height: "130px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle at 40% 40%, rgba(201,168,76,0.15), rgba(201,168,76,0.04))",
                  border: "2px solid rgba(201,168,76,0.4)",
                  boxShadow: "0 0 30px rgba(201,168,76,0.15), 0 4px 20px rgba(0,0,0,0.08)",
                  zIndex: 20,
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/pillar-image.png"
                  alt="Brook Skincare"
                  width={130}
                  height={130}
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
            </div>

            {/* Hint text */}
            <p
              className="text-xs mt-4 text-center"
              style={{ color: "rgba(10,31,20,0.4)" }}
            >
              Click a pillar node to select · Click the logo to rotate
            </p>
          </div>

          {/* ══════════════════════════
               RIGHT — Active Pillar Detail
          ══════════════════════════ */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.3s",
            }}
          >
            {/* Active pillar highlight card */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
            >
              {/* Gold top border */}
             

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{active.emoji}</span>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-0.5"
                    style={{ color: "rgba(201,168,76,0.6)" }}
                  >
                    Pillar {active.num}
                  </p>
                  <h3
                    className="font-semibold text-white text-xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {active.name}
                  </h3>
                </div>
                
                <div
                  className="ml-auto w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "#C9A84C" }}
                />
              </div>
              <div
                className="w-full h-[2px] rounded-full mb-5"
                style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }}
              />

              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {active.desc}
              </p>
            </div>

            {/* All pillars list */}
            <div className="space-y-2">
              {pillars.map((pillar, i) => {
                const isActive = activePillar === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleNodeClick(i)}
                    className="w-full text-left rounded-xl px-4 py-3 transition-all duration-300 flex items-center gap-4"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(201,168,76,0.1)"
                        : "rgba(10,31,20,0.04)",
                      border: isActive
                        ? "1px solid rgba(201,168,76,0.35)"
                        : "1px solid rgba(10,31,20,0.08)",
                      transform: isActive ? "translateX(6px)" : "translateX(0)",
                    }}
                  >
                    {/* Number */}
                    <span
                      className="flex-shrink-0 font-medium"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "13px",
                        color: isActive ? "#9A7A2E" : "rgba(10,31,20,0.35)",
                        minWidth: "28px",
                      }}
                    >
                      {pillar.num}
                    </span>

                    {/* Emoji */}
                    <span className="text-lg flex-shrink-0">{pillar.emoji}</span>

                    {/* Name */}
                    <span
                      className="text-sm font-semibold uppercase tracking-wider flex-1"
                      style={{
                        color: isActive ? "#0A1F14" : "rgba(10,31,20,0.55)",
                        letterSpacing: "1px",
                      }}
                    >
                      {pillar.name}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#C9A84C" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div
              className="mt-8 pt-6 flex items-center gap-8"
              style={{ borderTop: "1px solid rgba(10,31,20,0.1)" }}
            >
              <a
                href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ color: "#9A7A2E" }}
                >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                 <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                 <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
               </svg>
                Watch on YouTube
              </a>
              <Link
                href="/learn"
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "#9A7A2E" }}
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
        }
      `}</style>
    </section>
  );
}