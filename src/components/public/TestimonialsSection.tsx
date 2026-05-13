"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sara M.",
    location: "Addis Ababa, Ethiopia",
    role: "Client — Melasma Treatment",
    initial: "S",
    text: "I had been struggling with melasma for over 5 years. After just 8 weeks following Brook's 5-Pillar method, my skin looked completely different. For the first time I felt confident going out without heavy makeup.",
  },
  {
    id: 2,
    name: "Hana T.",
    location: "London, UK",
    role: "Client — Hyperpigmentation",
    initial: "H",
    text: "Brook is not just a skincare specialist — He is a life changer. His approach is so scientific yet so personal. He explained everything clearly and the results were beyond what I imagined possible.",
  },
  {
    id: 3,
    name: "Mekdes B.",
    location: "Toronto, Canada",
    role: "Client — Bleaching Damage Recovery",
    initial: "M",
    text: "I damaged my skin badly with bleaching creams for years. Brook helped me repair my barrier and restore my natural skin. I wish I found her sooner. His knowledge of melanin-rich skin is unmatched.",
  },
  {
    id: 4,
    name: "Fatima A.",
    location: "Dubai, UAE",
    role: "Client — Sun Damage Treatment",
    initial: "F",
    text: "The online consultation was so easy and professional. Despite being in Dubai, it felt like He was right there with me. My dark spots have faded significantly and my skin finally feels healthy.",
  },
  {
    id: 5,
    name: "Tigist W.",
    location: "Stockholm, Sweden",
    role: "Client — Acne Scarring",
    initial: "T",
    text: "Brook understands dark skin in a way most dermatologists do not. She gave me a routine that actually works for my skin type. Six months later and my acne scars are barely visible. Absolutely incredible.",
  },
];

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const prev = () => setActive(a => Math.max(0, a - 1));
  const next = () => setActive(a => Math.min(testimonials.length - 1, a + 1));

  // Show 3 cards: prev, active, next
  const getVisibleCards = () => {
    const cards = [];
    for (let i = active - 1; i <= active + 1; i++) {
      if (i >= 0 && i < testimonials.length) {
        cards.push({ testimonial: testimonials[i], position: i - active });
      }
    }
    return cards;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 20% 50%, rgba(201,168,76,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 30%, rgba(10,31,20,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── HEADER ── */}
        <div
          className="text-center mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#9A7A2E" }}
          >
            Client Stories
          </span>

          {/* Title matching your design */}
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              color: "#0A1F14",
            }}
          >
            Gratitude In Every{" "}
            <em
              className="not-italic font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Word
            </em>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "rgba(10,31,20,0.55)", lineHeight: 1.7 }}
          >
            Every skin journey is deeply personal. These are the words of real
            clients who trusted Brook Skincare with their most vulnerable concern
            — and found their confidence again.
          </p>
        </div>

        {/* ── CARDS ── */}
        <div
          className="relative flex items-center justify-center gap-6 min-h-[380px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={active === 0}
            className="absolute left-0 z-20 p-3 rounded-full transition-all hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <ChevronLeft size={20} style={{ color: "#9A7A2E" }} />
          </button>

         
          {/* Cards container */}
            <div className="flex items-center justify-center gap-4 w-full px-0 md:px-16">
              {getVisibleCards().map(({ testimonial: t, position }) => {
                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;

                return (
                  <div
                    key={t.id}
                    onClick={() => !isCenter && setActive(testimonials.indexOf(t))}
                    className={`relative transition-all duration-500 flex-shrink-0 ${
                      !isCenter ? "hidden md:block" : "block"
                    }`}
                    style={{
                      width: isCenter ? "380px" : "260px",
                      opacity: isCenter ? 1 : 0.55,
                      transform: isCenter
                        ? "scale(1) translateY(0)"
                        : "scale(0.88) translateY(16px)",
                      cursor: isCenter ? "default" : "pointer",
                      zIndex: isCenter ? 10 : 1,
                    }}
                  >
                  <style>{`
                        @media (min-width: 768px) {
                          .side-card-${t.id} { display: block !important; }
                             }
                     `}</style>
                  <div className={`${!isCenter ? `side-card-${t.id}` : ""}`}>
                {/* Card wrapper — stacked effect */}
                    <div className="relative" style={{ marginTop: "30px" }}>

                        {/* ── BACK CARD (dark, peeking behind right side) ── */}
                    <div
                        className="absolute"
                        style={{
                            top: "10px",
                            right: "-14px",
                            width: "100%",
                            height: "100%",
                            backgroundColor: isCenter ? "#0A1F14" : "#1A3D2B",
                            borderRadius: "4px 4px 40px 40px",
                            zIndex: 0,
                            opacity: isCenter ? 1 : 0.5,
                        }}
                        />

                        {/* ── FRONT CARD ── */}
                        <div
                        className="relative transition-all duration-500"
                        style={{
                            backgroundColor: "white",
                            boxShadow: isCenter
                            ? "0 20px 60px rgba(10,31,20,0.12)"
                            : "0 4px 20px rgba(10,31,20,0.05)",
                            border: isCenter
                            ? "1px solid rgba(201,168,76,0.2)"
                            : "1px solid rgba(10,31,20,0.06)",
                            borderRadius: "4px 4px 40px 40px",
                            padding: "50px 28px 28px 28px",
                            zIndex: 1,
                        }}
                        >

                        {/* ── AVATAR — sits on top edge ── */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{ top: "-26px" }}
                        >
                            <div
                            className="rounded-full flex items-center justify-center font-bold text-white"
                            style={{
                                width: isCenter ? "52px" : "42px",
                                height: isCenter ? "52px" : "42px",
                                background: "linear-gradient(135deg, #C9A84C, #0A1F14)",
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: isCenter ? "20px" : "16px",
                                border: "3px solid white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                            >
                            {t.initial}
                            </div>
                        </div>

                        {/* ── CLIENT INFO ── */}
                        <div className="text-center mb-4">
                            <p
                            className="font-semibold"
                            style={{
                                color: "#0A1F14",
                                fontSize: isCenter ? "15px" : "13px",
                            }}
                            >
                            {t.name}
                            </p>
                            <p
                            style={{
                                color: "#9A7A2E",
                                fontSize: isCenter ? "11px" : "10px",
                            }}
                            >
                            {t.role}
                            </p>
                        </div>

                        {/* ── BIG QUOTE MARK ── */}
                        <div
                            className="text-center mb-2"
                            style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "32px",
                            lineHeight: 1,
                            color: "#C9A84C",
                            opacity: 0.6,
                            }}
                        >
                            "
                        </div>

                        {/* ── QUOTE TEXT ── */}
                        <p
                            className={`text-center leading-relaxed ${isCenter ? "text-sm" : "text-xs"}`}
                            style={{
                            color: "rgba(10,31,20,0.65)",
                            lineHeight: 1.8,
                            display: "-webkit-box",
                            WebkitLineClamp: isCenter ? 6 : 5,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            }}
                        >
                            {t.text}
                        </p>

                        {/* ── LOCATION + STARS ── */}
                        <div
                            className="flex items-center justify-center gap-2 mt-4 pt-3"
                            style={{ borderTop: "1px solid rgba(10,31,20,0.06)" }}
                        >
                            <p style={{ color: "rgba(10,31,20,0.4)", fontSize: "10px" }}>
                            📍 {t.location}
                            </p>
                            {isCenter && (
                            <div className="flex items-center gap-0.5 ml-2">
                                {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: "#C9A84C", fontSize: "10px" }}>★</span>
                                ))}
                            </div>
                            )}
                      </div>
                     </div>
                    </div>
                </div>
             </div>
                );
                })}
            </div>

            {/* Next button */}
            <button
                onClick={next}
                disabled={active === testimonials.length - 1}
                className="absolute right-0 z-20 p-3 rounded-full transition-all hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
                style={{
                backgroundColor: "white",
                border: "1px solid rgba(201,168,76,0.3)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
            >
              <ChevronRight size={20} style={{ color: "#9A7A2E" }} />
            </button>
            </div>

            {/* ── DOTS ── */}
            <div className="flex items-center justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
                <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                width: active === i ? "24px" : "8px",
                height: "8px",
                backgroundColor: active === i
                  ? "#C9A84C"
                  : "rgba(10,31,20,0.2)",
              }}
            />
          ))}
        </div>

        {/* Mobile prev/next */}
        <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
          <button
            onClick={prev}
            disabled={active === 0}
            className="p-3 rounded-full disabled:opacity-20"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <ChevronLeft size={18} style={{ color: "#9A7A2E" }} />
          </button>
          <button
            onClick={next}
            disabled={active === testimonials.length - 1}
            className="p-3 rounded-full disabled:opacity-20"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <ChevronRight size={18} style={{ color: "#9A7A2E" }} />
          </button>
        </div>

        {/* ── CTA ── */}
        <div
          className="text-center mt-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              color: "#0A1F14",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            Start Your Journey
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}