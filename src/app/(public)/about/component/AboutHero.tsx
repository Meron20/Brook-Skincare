"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { credentials } from "./about.data";
import SectionHeader from "../../SectionHeader";

export default function AboutStory() {
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
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: credentials card ── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease",
            }}
          >
            <div
              className="relative rounded-3xl p-9 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0F2D1E, #0A1F14)",
                border: "1px solid rgba(201,168,76,0.3)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.2)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }}
              />

              {/* Logo + name */}
              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className="w-24 h-24 rounded-full mb-4 overflow-hidden"
                  style={{
                    border: "2px solid rgba(201,168,76,0.4)",
                    boxShadow: "0 8px 30px rgba(201,168,76,0.2)",
                  }}
                >
                  <Image
                    src="/brook-logo.jpeg"
                    alt="Brook Skincare logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Brook
                </h3>
                <p className="text-sm" style={{ color: "#C9A84C" }}>
                  Registered Nurse · Skin Therapist · Melasma Specialist
                </p>
              </div>

              {/* Book */}
              <div
                className="flex items-center gap-4 p-4 rounded-2xl mb-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                <div
                  className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ border: "1px solid rgba(201,168,76,0.3)" }}
                >
                  <Image
                    src="/brook-book.jpeg"
                    alt="Brook Skin Guide"
                    width={40}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Published Author</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Melasma guide in English & Amharic
                  </p>
                </div>
              </div>

              {/* Credentials list */}
              <div className="space-y-3">
                {credentials.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "#C9A84C" }}
                    />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: story text ── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            <SectionHeader label="My Story" title="Why I Built" highlight="Brook Skincare" />

            <div
              className="space-y-4 text-base mb-8"
              style={{ color: "rgba(10,31,20,0.6)", lineHeight: 1.8 }}
            >
              <p>
                I was born and raised in Ethiopia. I moved to Sweden to study
                nursing, and I have worked in clinical care for over eight years.
                Throughout that journey, one thing troubled me deeply: people with
                dark skin — Ethiopian people, African people — had almost nowhere
                to turn for honest, clear, science-based guidance about their skin.
              </p>
              <p>
                The big skincare brands were not made for our skin. Dermatology
                textbooks were written primarily for lighter skin tones. Videos
                were made for people who look different to you and me.
              </p>
              <p>
                I started my YouTube channel to change that. I explained skin
                science the way a trusted friend would — simply, honestly, and in
                a way that actually made sense.{" "}
                <strong style={{ color: "#0A1F14" }}>45,000 people subscribed.</strong>
              </p>
              <p className="font-semibold" style={{ color: "#0A1F14" }}>
                This website, these consultations, and these books are the next
                step. By a nurse. For Ethiopian skin. Built for you.
              </p>
            </div>

            {/* Buttons */}
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
                className="flex items-center gap-2 px-7 py-4 rounded-full font-medium text-sm transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(10,31,20,0.08)",
                  color: "#0A1F14",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                </svg>
                Our YouTube Channel
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}