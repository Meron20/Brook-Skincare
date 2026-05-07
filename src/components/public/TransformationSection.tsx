"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type Transformation = {
    id: number;
    name: string;
    location: string;
    concern: string;
    duration: string;
    result: string;
    initial: string;
    beforeImage: string;
    afterImage: string;
  };

const transformations = [
  {
    id: 1,
    name: "Sara M.",
    location: "Addis Ababa, Ethiopia",
    concern: "Melasma",
    duration: "8 weeks",
    result: "Significant fade in dark patches",
    initial: "S",
    beforeImage: "/melasma.jpeg",
    afterImage: "/melasma.jpeg",
  },
  {
    id: 2,
    name: "Hana T.",
    location: "London, UK",
    concern: "Post-inflammatory hyperpigmentation",
    duration: "12 weeks",
    result: "Even skin tone restored",
    initial: "H",
    beforeImage: "/hyperpigmentation.jpeg",
    afterImage: "/hyperpigmentation.jpeg",
  },
  {
    id: 3,
    name: "Mekdes B.",
    location: "Toronto, Canada",
    concern: "Bleaching cream damage",
    duration: "16 weeks",
    result: "Skin barrier fully repaired",
    initial: "M",
    beforeImage: "/melasma.jpeg",
    afterImage: "/melasma.jpeg",
  },
  {
    id: 4,
    name: "Fatima A.",
    location: "Dubai, UAE",
    concern: "Sun damage & dark spots",
    duration: "10 weeks",
    result: "Brighter, more even complexion",
    initial: "F",
    beforeImage: "/hyperpigmentation.jpeg",
    afterImage: "/hyperpigmentation.jpeg",
  },
];

const TransformationCard = ({ t }: { t: Transformation }) => (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0 w-full"
      style={{
        border: "1px solid rgba(201,168,76,0.2)",
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Gold top line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent, #C9A84C, #E8C96A, #C9A84C, transparent)",
        }}
      />
  
      {/* Before & After images */}
      <div className="grid grid-cols-2">
  
        {/* BEFORE — left half */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1" }}>
          <div
            className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full font-semibold uppercase"
            style={{
              backgroundColor: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              backdropFilter: "blur(8px)",
              fontSize: "9px",
            }}
          >
            Before
          </div>
          <div
            className="w-full h-full relative  "
            style={{ borderRight: "1px solid rgba(201,168,76,0.1)" }}
          >
            <Image
              src={t.beforeImage}
              alt={`${t.name} before`}
              fill
              className="object-cover"
              style={{ objectPosition: "-5% center" }}
              sizes="25vw"
            />
          </div>
        </div>
  
        {/* AFTER — right half */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1" }}>
          <div
            className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full font-semibold uppercase"
            style={{
              backgroundColor: "rgba(52,211,153,0.15)",
              border: "1px solid rgba(52,211,153,0.3)",
              color: "#34d399",
              backdropFilter: "blur(8px)",
              fontSize: "9px",
            }}
          >
            After
          </div>
          <Image
            src={t.afterImage}
            alt={`${t.name} after`}
            fill
            className="object-cover"
            style={{ objectPosition: "115% center" }}
            sizes="25vw"
          />
        </div>
  
      </div>
  
      {/* Duration badge */}
      <div
        className="flex justify-center py-1.5"
        style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
      >
        <span
          className="font-semibold px-3 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
            color: "#0A1F14",
            fontSize: "10px",
          }}
        >
          {t.duration}
        </span>
      </div>
  
      {/* Client info */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #0A1F14)",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {t.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-xs">{t.name}</p>
          <p
            className="truncate"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
          >
            {t.location}
          </p>
        </div>
        <span style={{ color: "#34d399", fontSize: "10px" }}>
          ✓ Verified
        </span>
      </div>
    </div>
  );
export default function TransformationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(transformations.length / 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleCards = transformations.slice(page * 2, page * 2 + 2);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 30%, rgba(74,144,164,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── SECTION HEADER ── */}
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
            Real Results
          </span>
          <h2
            className="font-light text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            See the{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transformation
            </strong>
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
          >
            Real clients, real results. Every journey is unique — but the
            science behind each transformation is the same proven 5-Pillar method.
          </p>
        </div>

        {/* ── TWO CARDS + NAVIGATION ── */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease 0.3s",
          }}
        >
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {visibleCards.map(t => (
              <TransformationCard key={t.id} t={t} />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2.5 rounded-full transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              <ChevronLeft size={18} style={{ color: "#C9A84C" }} />
            </button>

            {/* Page dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: page === i ? "20px" : "8px",
                    height: "8px",
                    backgroundColor: page === i ? "#C9A84C" : "rgba(201,168,76,0.3)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2.5 rounded-full transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              <ChevronRight size={18} style={{ color: "#C9A84C" }} />
            </button>
          </div>

          {/* Counter */}
          <p
            className="text-center mt-3 text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Showing {page * 2 + 1}–{Math.min(page * 2 + 2, transformations.length)} of {transformations.length} transformations
          </p>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div
          className="text-center mt-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Ready to start your own transformation?
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              color: "#0A1F14",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            Book Your Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}