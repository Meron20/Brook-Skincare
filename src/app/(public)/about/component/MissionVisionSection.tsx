"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import { missionVision } from "./about.data";
import SectionHeader from "../../SectionHeader";

export default function MissionVisionSection() {
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
      className="relative py-24 overflow-hidden"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: heading + mission/vision cards ── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease",
            }}
          >
            <SectionHeader
              label="Where Brook Skincare Is Heading"
              title="Skincare education made for"
              highlight="real skin"
            />

            <div className="flex flex-col gap-5 mt-8">
              {missionVision.map(({ title, text, icon: Icon }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} style={{ color: "#9A7A2E" }} />
                  </div>

                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "#0A1F14", fontSize: "15px" }}
                    >
                      {title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(10,31,20,0.55)" }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: image + floating card ── */}
          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            <div className="relative w-full max-w-[400px]">
          
             {/* Image */}
              <div
                className="relative h-[460px] rounded-3xl overflow-hidden px-10 py-14"
                style={{
                  background: "linear-gradient(135deg, #0F2D1E, #0A1F14)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  boxShadow: "0 20px 80px rgba(0,0,0,0.2)",
                }}
              >
                {/* Gold top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }}
                />

                <div className="relative w-full h-full">
                  <Image
                    src="/brook-book.jpeg"
                    alt="Brook Skincare"
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Floating card */}
              <div
                className="absolute -bottom-6 -left-6 max-w-[280px] p-5 rounded-2xl hidden sm:block"
                style={{
                  backgroundColor: "#0A1F14",
                  border: "1px solid rgba(201,168,76,0.3)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  animation: "floatSoft 5s ease-in-out infinite",
                }}
              >
                <Sparkles size={18} strokeWidth={1.8} className="mb-3" style={{ color: "#C9A84C" }} />
                <p
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Honest. Clinical. Personal.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  A skincare space designed to help you understand your skin, not fear it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}