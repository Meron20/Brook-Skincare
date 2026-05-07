"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { credentials } from "./about.data";

export default function AboutHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative px-4 pb-8 pt-14 sm:px-5 md:px-8 md:pb-10 md:pt-16 lg:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-[320px] w-[320px] rounded-full bg-[#C9A84C]/15 blur-[100px] md:h-[420px] md:w-[420px]" />
        <div className="absolute -right-32 top-0 h-[360px] w-[360px] rounded-full bg-[#071F14]/15 blur-[120px] md:h-[520px] md:w-[520px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div
          className="relative"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
            transition: "all 850ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#C9A84C]/60 bg-[#071F14] p-5 shadow-2xl shadow-[#071F14]/25 transition-all duration-700 hover:shadow-[0_0_55px_rgba(201,168,76,0.15)] sm:p-6 md:rounded-[2rem] md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(201,168,76,0.22),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.08),transparent_30%)]" />

            <div className="relative z-10">
              <div className="mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full border border-[#C9A84C]/70 bg-black shadow-[0_0_50px_rgba(201,168,76,0.25)] sm:h-28 sm:w-28 md:mb-10 md:h-28 md:w-28">
                <Image
                  src="/brook-logo.jpeg"
                  alt="Brook Skincare logo"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <h2
                className="text-4xl font-semibold text-white md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Brook
              </h2>

              <p className="mt-2 text-sm font-medium text-[#C9A84C] md:text-base">
                Registered Nurse | Skin Therapist | Melasma Specialist
              </p>

              <div className="mt-6 rounded-2xl border border-[#C9A84C]/25 bg-white/[0.06] p-4 backdrop-blur-xl sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8F5EF] shadow-lg">
                    <Image
                      src="/brook-book.jpeg"
                      alt="Brook Skin Guide"
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C]/85">
                      Published Author
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Brook Skin Guide
                    </p>

                    <p className="text-sm leading-5 text-white/55">
                      Melasma & Hyperpigmentation English & Amharic Edition
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 md:mt-6 md:space-y-3">
                {credentials.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-white/86"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="relative z-20 mx-auto -mt-1 w-[92%] rounded-2xl border border-[#C9A84C]/15 bg-white px-4 py-4 shadow-2xl shadow-[#071F14]/15 sm:w-[82%] sm:px-6 md:w-[68%]"
            style={{ animation: "floatSoft 5s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-4">
              <p
                className="text-4xl font-semibold text-[#C9A84C]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                45K
              </p>

              <div>
                <p className="font-semibold text-[#232336]">
                  YouTube Community
                </p>

                <p className="text-sm text-[#232336]/60">
                  Trusted by Ethiopian & African skin worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center lg:text-left"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(30px)",
            transition: "all 850ms cubic-bezier(0.22,1,0.36,1) 140ms",
          }}
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#C9A84C]">
            About Brook
          </p>

          <h1
            className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:mx-0 lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Nurse Who Understands Your Skin
          </h1>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-7 text-[#343454]/80 md:text-lg md:leading-8 lg:mx-0">
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
              <strong>45,000 people subscribed.</strong>
            </p>

            <p>
              This website, these consultations, and these books are the next
              step.{" "}
              <strong>By a nurse. For Ethiopian skin. Built for you.</strong>
            </p>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap lg:justify-start">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] px-8 py-4 font-semibold text-[#071F14] shadow-xl shadow-[#C9A84C]/20 transition duration-500 hover:-translate-y-0.5"
            >
              Book a Consultation
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#071F14]/10 bg-white/50 px-8 py-4 font-semibold text-[#232336] backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:bg-white"
            >
              <Stethoscope
                size={20}
                strokeWidth={1.8}
                className="text-[#C9A84C]"
              />
              Our Services
            </Link>

            <a
              href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/20 bg-[#FFF7F0] px-8 py-4 font-semibold text-[#9A7A2E] shadow-sm transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(201,168,76,0.16)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  fill="white"
                />
              </svg>

              Our YouTube Channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}