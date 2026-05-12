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
    <section className="relative overflow-hidden bg-[#F6F7F4] px-4 py-10 sm:px-6 md:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-[520px] w-[520px] rounded-full bg-[#D9B953]/20 blur-[130px]" />
        <div className="absolute -right-20 top-0 h-[620px] w-[620px] rounded-full bg-[#0B2418]/14 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.72),transparent_48%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div
          className="relative order-last mx-auto w-full max-w-[560px] lg:order-first lg:max-w-none"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
            transition: "all 850ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#C9A84C]/70 bg-[#071F14] p-6 shadow-[0_28px_90px_rgba(7,31,20,0.25)] sm:p-8 lg:min-h-[520px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_12%,rgba(201,168,76,0.24),transparent_35%),radial-gradient(circle_at_85%_92%,rgba(255,255,255,0.08),transparent_30%)]" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#F4D87A] to-[#C9A84C]" />

            <div className="relative z-10">
              <div className="mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full border border-[#C9A84C]/80 bg-black shadow-[0_0_55px_rgba(201,168,76,0.3)]">
                <Image
                  src="/brook-logo.jpeg"
                  alt="Brook Skincare logo"
                  width={180}
                  height={180}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <h2
                className="text-3xl font-semibold leading-none text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Brook
              </h2>

              <p className="mt-3 text-base font-semibold text-[#E8C96A]">
                Registered Nurse | Skin Therapist | Melasma Specialist
              </p>

              <div className="mt-6 rounded-2xl border border-[#C9A84C]/20 bg-white/[0.06] p-4 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F8F5EF] shadow-lg">
                    <Image
                      src="/brook-book.jpeg"
                      alt="Brook Skin Guide"
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">
                      Published Author
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      Brook Skin Guide
                    </p>

                    <p className="text-base leading-6 text-white/65">
                      Melasma & Hyperpigmentation English & Amharic Edition
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {credentials.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-base font-medium leading-7 text-white/88"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="relative z-20 mx-auto -mt-10 w-[82%] rounded-2xl border border-[#C9A84C]/25 bg-white/95 px-6 py-4 shadow-[0_18px_45px_rgba(7,31,20,0.14)] backdrop-blur-xl"
            style={{ animation: "floatSoft 5s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-5">
              <p
                className="text-4xl font-semibold leading-none text-[#C9A84C]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                45K
              </p>

              <div>
                <p className="text-lg font-semibold text-[#232336]">
                  YouTube Community
                </p>

                <p className="text-base text-[#232336]/60">
                  Trusted by Ethiopian & African skin worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="order-first mx-auto max-w-4xl self-start pt-2 text-center lg:order-last lg:mx-0 lg:pt-0 lg:text-left"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(30px)",
            transition:
              "all 850ms cubic-bezier(0.22,1,0.36,1) 140ms",
          }}
        >
          <p className="mb-4 text-base font-semibold uppercase tracking-[0.32em] text-[#C9A84C]">
            About Brook
          </p>

          <h1
            className="mx-auto max-w-4xl text-[2.2rem] font-semibold leading-[1.08] tracking-tight text-[#252538] sm:text-[3rem] lg:mx-0 xl:text-[3.7rem]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Nurse Who{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#F4D87A] bg-clip-text text-transparent">
              Understands
            </span>{" "}
            Your{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#F4D87A] bg-clip-text text-transparent">
              Skin
            </span>
          </h1>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-left text-base leading-7 text-[#343454]/85 lg:mx-0">
            <p>
              I was born and raised in Ethiopia. I moved to Sweden to study
              nursing, and I have worked in clinical care for over eight years.
              Throughout that journey, one thing troubled me deeply: people with
              dark skin — Ethiopian people, African people — had almost nowhere
              to turn for honest, clear, science-based guidance about their
              skin.
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
              <strong className="font-semibold text-[#11111D]">
                45,000 people subscribed.
              </strong>
            </p>

            <p className="font-semibold text-[#252538]">
              This website, these consultations, and these books are the next
              step. By a nurse. For Ethiopian skin. Built for you.
            </p>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-5 sm:flex-row sm:flex-wrap lg:justify-start">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] px-8 py-3.5 text-[15px] font-semibold text-[#071F14] shadow-xl shadow-[#C9A84C]/20 transition duration-500 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Book a Consultation
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#071F14]/15 bg-white/70 px-8 py-3.5 text-[15px] font-semibold text-[#232336] backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
            >
              <Stethoscope
                size={21}
                strokeWidth={1.8}
                className="text-[#C9A84C]"
              />
              Our Services
            </Link>

            <a
              href="https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#C9A84C]/50 bg-[#FFF7F0] px-8 py-3.5 text-[15px] font-semibold text-[#232336] shadow-sm transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(201,168,76,0.16)]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000">
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