"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Minus, Plus, Sparkles } from "lucide-react";
import { faqs } from "./contact.data";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-[#0D241B] px-4 py-16 text-white sm:px-5 md:px-8 md:py-24">
      <div className="absolute inset-0 bg-[#0D241B]/94" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#C9A84C]/10 blur-[110px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#C9A84C]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto min-h-[520px] w-full max-w-[520px] overflow-visible lg:max-w-none">
          <div className="absolute right-0 top-0 h-[430px] w-full overflow-hidden rounded-[2.25rem] border border-[#C9A84C]/25 bg-[#071F14] shadow-2xl shadow-black/25 sm:h-[520px] sm:rounded-[3rem] lg:w-[420px]">
            <Image
              src="/brook-book.jpeg"
              alt="Brook Skincare book"
              fill
              className="object-cover opacity-90 transition-transform duration-[1200ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/75 via-[#071F14]/10 to-transparent" />
          </div>

          <div
            className="absolute bottom-5 left-1/2 z-20 w-[88%] -translate-x-1/2 rounded-3xl border border-[#C9A84C]/20 bg-[#071F14]/85 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-[#C9A84C]/45 hover:bg-[#071F14]/92 sm:bottom-6 sm:left-0 sm:w-[360px] sm:translate-x-0 sm:p-6 lg:-left-6"
            style={{ animation: "floatSide 5.8s ease-in-out infinite" }}
          >
            <BookOpen
              className="mb-4 text-[#C9A84C]"
              size={26}
              strokeWidth={1.8}
            />
            <p
              className="text-2xl font-semibold text-white sm:text-3xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Questions before booking?
            </p>
            <p className="mt-3 max-w-xs leading-7 text-white/62">
              Learn what to expect before starting your skincare journey.
            </p>
          </div>
        </div>

        <div>
          <div className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
            <Sparkles size={16} strokeWidth={1.8} />
            FAQ
          </div>

          <h2
            className="mb-8 text-4xl font-semibold text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Frequently asked <span className="text-[#C9A84C]">questions</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-700 hover:-translate-y-[2px] ${
                    isOpen
                      ? "border-[#C9A84C]/40 bg-[#071F14]/80 shadow-[0_0_60px_rgba(201,168,76,0.18)]"
                      : "border-white/10 bg-white/[0.035] hover:border-[#C9A84C]/30 hover:bg-white/[0.06]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="relative z-10 flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="font-medium text-white/88">
                      {faq.q}
                    </span>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        isOpen
                          ? "rotate-180 bg-[#C9A84C] text-[#071F14]"
                          : "bg-[#C9A84C]/10 text-[#C9A84C]"
                      }`}
                    >
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>

                  <div
                    className={`relative z-10 grid transition-all duration-700 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-white/60 md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}