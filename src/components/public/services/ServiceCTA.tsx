"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ServicesCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)",
        }}
      />

      <div
        className="max-w-7xl mx-auto px-6 relative z-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        {/* ── MAIN CARD ── */}
        <div
          className="relative overflow-hidden rounded-4xl md:rounded-full"
          style={{
            background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
            border: "1px solid rgba(201,168,76,0.25)",
            padding: "32px 48px",
          }}
        >
          {/* Gold top border */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, transparent, #C9A84C, #E8C96A, #C9A84C, transparent)",
            }}
          />

          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)",
            }}
          />

          {/* ── 3 COLUMN GRID ── */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

            {/* COLUMN 1 — Logo + Clinic name */}
            <div className="flex items-center justify-center ">
                <Image
                    src="/brook-logo.jpeg"
                    alt="Brook Skincare"
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                    style={{ border: "2px solid rgba(201,168,76,0.4)" }}
                />
                </div>

            {/* Divider */}
            <div
              className="hidden md:block absolute left-[33%] top-0 bottom-0 w-px"
              style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
            />

            {/* COLUMN 2 — Heading + Description */}
            <div className="text-center ">
              <h2
                className="font-light text-white mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  lineHeight: 1.2,
                }}
              >
                Ready to Start Your{" "}
                <strong
                  className="font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Skin Journey?
                </strong>
              </h2>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}
              >
                Join 500+ clients worldwide who have transformed their skin
                with Brook's expert guidance. Your first step starts here.
              </p>
            </div>

            {/* Divider */}
            <div
              className="hidden md:block absolute left-[66%] top-0 bottom-0 w-px"
              style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
            />

            {/* COLUMN 3 — CTAs */}
            <div className="flex flex-col items-center  gap-3">
              <Link
                href="/login?redirect=/client-journal"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs transition-all hover:-translate-y-0.5 w-full md:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "#0A1F14",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
                }}
              >
                Book Your Consultation
                <ArrowRight size={15} />
              </Link>
               <a
              
                href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs transition-all hover:-translate-y-0.5 w-full md:w-auto justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                </svg>
                

                Watch on YouTube
              </a>
            </div>
          </div>

          {/* ── TRUST BADGES — centered below ── */}
          <div
            className="relative flex items-center justify-center gap-6 mt-6 pt-5 flex-wrap"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { icon: "🔒", label: "Secure booking" },
              { icon: "🌍", label: "Online worldwide" },
              { icon: "⭐", label: "5.0 rated" },
              { icon: "📋", label: "Medical-grade care" },
              { icon: "💬", label: "WhatsApp support" },
            ].map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-2"
              >
                <span className="text-base">{badge.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}