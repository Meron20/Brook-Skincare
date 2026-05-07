"use client";

import Image from "next/image";
import { expertPoints } from "./about.data";
import ExpertPoint from "./ExpertPoint";

export default function ExpertSection() {
  return (
    <section className="relative bg-[#0D241B] px-4 py-16 text-white sm:px-5 md:px-8 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#C9A84C]/10 blur-[110px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#C9A84C]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A84C]">
            Our Skin Expert
          </p>

          <h2
            className="text-4xl font-semibold md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Care shaped by clinical experience
          </h2>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.85fr_1fr] lg:gap-10">
          <div className="space-y-5 md:space-y-6">
            {expertPoints.slice(0, 2).map((point) => (
              <ExpertPoint key={point.title} {...point} />
            ))}
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-[260px] overflow-hidden rounded-t-[4rem] rounded-b-[2rem] border border-[#C9A84C]/20 bg-[#071F14] shadow-2xl shadow-black/25 sm:h-[360px] sm:max-w-[280px]">
            <Image
              src="/brook-logo.jpeg"
              alt="Brook Skin Expert"
              fill
              className="object-cover opacity-80"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/80 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[#C9A84C]/15 bg-[#071F14]/85 p-4 backdrop-blur-xl">
              <p className="font-semibold text-white">Brook</p>

              <p className="text-sm text-white/55">
                Nurse & Skin Therapist
              </p>
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">
            {expertPoints.slice(2).map((point) => (
              <ExpertPoint key={point.title} {...point} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}