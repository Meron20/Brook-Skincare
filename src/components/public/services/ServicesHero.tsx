"use client";

import { useEffect, useState } from "react";

export default function ServicesHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 20%, rgba(74,144,164,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 pointer-events-none hidden lg:block">
        {[500, 350, 200].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${-80 + i * 40}px`,
              right: `${-80 + i * 40}px`,
              border: "1px solid rgba(201,168,76,0.1)",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#C9A84C" }}
          >
            What We Offer
          </span>

          <h1
            className="font-light text-white mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
            }}
          >
            Our{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Skincare Services
            </strong>
          </h1>

          <p
            className="text-base max-w-2xl mx-auto mb-10"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}
          >
            Every consultation is tailored to your unique skin — guided by
            science, delivered with care. Choose the service that fits your
            journey and book your slot today.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {[
              { value: "500+", label: "Consultations Done" },
              { value: "50+", label: "Countries Served" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "8yr", label: "Clinical Experience" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="font-bold mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    color: "#C9A84C",
                  }}
                >
                  {value}
                </p>
                <p
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: "linear-gradient(to bottom, transparent, #F0F7F2)",
        }}
      /> */}
    </section>
  );
}