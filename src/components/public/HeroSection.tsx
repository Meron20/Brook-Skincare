"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Pause, Play } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const credentials = [
    {
      icon: "🏥",
      title: "Registered Nurse — Sweden",
      subtitle: "8 years of clinical patient care experience",
    },
    {
      icon: "✨",
      title: "Certified Skin Therapist",
      subtitle: "Specialised in melanin-rich and dark skin",
    },
    {
      icon: "📚",
      title: "Published Author",
      subtitle: "First melasma guide in English & Amharic",
    },
    {
      icon: "🌍",
      title: "Global Reach",
      subtitle: "Clients in 50+ countries worldwide",
    },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* ── BACKGROUND GRADIENTS ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 20% 80%, rgba(74,144,164,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 10%, rgba(201,168,76,0.04) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* ── DECORATIVE CIRCLES top right ── */}
      <div className="absolute top-0 right-0 pointer-events-none hidden lg:block">
        {[600, 400, 200].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${-100 + i * 50}px`,
              right: `${-100 + i * 50}px`,
              border: "1px solid rgba(201,168,76,0.12)",
              animation: `pulse-ring 4s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              backgroundColor: i === 2 ? "rgba(201,168,76,0.02)" : "transparent",
            }}
          />
        ))}
      </div>

      {/* ── NOISE TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ══════════════════════════
               LEFT — Video + Text
          ══════════════════════════ */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* ── VIDEO — wide, shorter ── */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl w-full mb-8"
              style={{
                border: "1px solid rgba(201,168,76,0.2)",
                aspectRatio: "16/9",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video girl.mp4" type="video/mp4" />
              </video>

              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(10,31,20,0.5) 0%, transparent 60%)",
                }}
              />

              {/* Play/Pause */}
              <button
                onClick={toggleVideo}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "rgba(201,168,76,0.9)" }}
              >
                {isPlaying
                  ? <Pause size={14} style={{ color: "#0A1F14" }} />
                  : <Play size={14} style={{ color: "#0A1F14" }} />
                }
              </button>

              {/* Live badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(10,31,20,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                <span className="text-xs font-medium" style={{ color: "#C9A84C" }}>
                  Real Results
                </span>
              </div>
            </div>

            {/* ── TEXT BELOW VIDEO ── */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
                style={{
                  backgroundColor: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "#C9A84C",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                Licensed Skincare Specialist
              </div>

              {/* Headline */}
              <h1
                className="font-bold leading-tight mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                Expert Care for{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Hyperpigmentation
                </span>{" "}
                & Skin Health
              </h1>

              {/* Subtitle */}
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px" }}
              >
                Professional skin consultations with a licensed nurse and skincare
                specialist — available online, worldwide. Start your journey to
                clearer, healthier skin today.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-8 mb-8">
                {[
                  { value: "500+", label: "Consultations" },
                  { value: "50+", label: "Countries" },
                  { value: "45k+", label: "Subscribers" },
                  { value: "98%", label: "Satisfaction" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#C9A84C",
                      }}
                    >
                      {value}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                    color: "#0A1F14",
                    boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                  }}
                >
                  Book a Consultation
                  <ArrowRight size={16} />
                </Link>
                <a
                    href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium transition-all hover:-translate-y-0.5 bg-amber-50 rounded-2xl p-4"
                    style={{ color: "#9A7A2E" }}
                    >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                  </svg>
                  Our YouTube Channel
                </a>
              </div>
            </div>
          </div>

          {/* ══════════════════════════
               RIGHT — Credential Card
          ══════════════════════════ */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          >
            <div
              className="relative rounded-3xl p-9 overflow-hidden"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,168,76,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Gold top border line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)",
                }}
              />

              {/* Specialist photo + name */}
              <div className="flex flex-col items-center text-center mb-8">
              <div
                    className="w-28 h-28 rounded-full mb-4 overflow-hidden"
                    style={{
                        border: "2px solid rgba(201,168,76,0.4)",
                        boxShadow: "0 8px 30px rgba(201,168,76,0.2)",
                    }}
                    >
                    <Image
                        src="/logo.jpeg"
                        alt="Brook Skincare Specialist"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>

                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#C9A84C" style={{ color: "#C9A84C" }} />
                  ))}
                </div>

                <h3
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Why Choose Brook?
                </h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Credentials that make the difference
                </p>
              </div>

              {/* Credential items */}
              <div className="space-y-1">
              {credentials.map((cred, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 py-4"
                    style={{
                    borderBottom: i < credentials.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                    }}
                >
                    {/* Left icon */}
                    <div
                    className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-lg"
                    style={{
                        backgroundColor: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.2)",
                    }}
                    >
                    {cred.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                    <p className="text-sm font-medium text-white">{cred.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {cred.subtitle}
                    </p>
                    </div>

                    {/* Book photo — only for Published Author */}
                    {cred.title === "Published Author" && (
                    <div
                        className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ border: "1px solid rgba(201,168,76,0.3)" }}
                    >
                        <Image
                        src="/brook-book.jpeg"
                        alt="Brook Book"
                        width={40}
                        height={48}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    )}
                </div>
                ))}
             
              </div>

              {/* Booking CTA inside card */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                  href="/services"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                    color: "#0A1F14",
                    boxShadow: "0 4px 20px rgba(201,168,76,0.25)",
                  }}
                >
                  Book a Consultation
                  <ArrowRight size={16} />
                </Link>

                {/* Trust note */}
                <p
                  className="text-center text-xs mt-3"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  🔒 Secure booking · No commitment required
                </p>
              </div>
            </div>

            {/* Floating stats card below credential card */}
            <div
              className="mt-4 grid grid-cols-3 gap-3"
            >
              {[
                { emoji: "🌍", value: "50+", label: "Countries" },
                { emoji: "⭐", value: "5.0", label: "Rating" },
                { emoji: "🏥", value: "8yr", label: "Experience" },
              ].map(({ emoji, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-4 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  <span className="text-lg mb-1">{emoji}</span>
                  <p
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#C9A84C",
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    

      {/* ── CSS ANIMATIONS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }

        @keyframes scroll-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}