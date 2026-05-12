"use client";

import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function AboutCtaSection() {
  return (
    <section className="px-4 pb-16 sm:px-5 md:px-8 md:pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#C9A84C]/20 bg-gradient-to-br from-[#071F14] to-[#0E2A1E] p-6 shadow-2xl shadow-[#071F14]/20 sm:p-8 md:rounded-[2.5rem] md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#C9A84C]/10 blur-[90px]" />

        <div className="relative z-10 grid gap-8 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
              Personalised skincare
            </p>

            <h2
              className="text-4xl font-semibold text-white md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Ready for radiant skin?
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-white/62 md:mx-0">
              Book your personalised skincare session today and discover your
              natural glow.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] px-8 py-4 font-semibold text-[#071F14] shadow-xl shadow-[#C9A84C]/20 transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(201,168,76,0.24)]"
          >
            <Stethoscope size={20} strokeWidth={1.8} />
            Schedule appointment
          </Link>
        </div>
      </div>
    </section>
  );
}