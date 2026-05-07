"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { missionVision } from "./about.data";

export default function MissionVisionSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-8 lg:px-12"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 15% 45%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 30%, rgba(74,144,164,0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7A2E]">
              Where Brook Skincare Is Heading
            </p>

            <h2
              className="max-w-3xl text-[2.45rem] font-semibold leading-[1.08] tracking-tight text-[#0A1F14] sm:text-[2.9rem] lg:text-[3.4rem]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Clear skincare education made for{" "}
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] bg-clip-text text-transparent">
                real people
              </span>{" "}
              and real skin.
            </h2>

            <div className="mt-8 space-y-4">
              {missionVision.map(({ title, text, icon: Icon }) => (
                <div
                  key={title}
                  className="group rounded-[1.7rem] border border-[#C9A84C]/15 bg-[#FFF7F0] p-5 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-[0_0_45px_rgba(201,168,76,0.12)] sm:p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071F14] text-[#C9A84C]">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <h3
                    className="text-2xl font-semibold text-[#0A1F14]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#343454]/70">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto min-h-[500px] w-full max-w-[500px] overflow-visible lg:max-w-none">
            <div className="absolute right-0 top-0 h-[410px] w-full overflow-hidden rounded-[2rem] border border-[#C9A84C]/25 bg-[#071F14] shadow-2xl shadow-[#071F14]/20 sm:h-[500px] sm:rounded-[2.5rem] lg:w-[400px]">
              <Image
                src="/brook-book.jpeg"
                alt="Brook Skincare"
                fill
                className="object-cover opacity-90 transition-transform duration-[1200ms] hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/75 via-[#071F14]/10 to-transparent" />
            </div>

            <div
              className="absolute bottom-6 left-1/2 z-20 w-[88%] -translate-x-1/2 rounded-3xl border border-[#C9A84C]/20 bg-[#071F14]/85 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-[#C9A84C]/45 hover:bg-[#071F14]/92 sm:left-0 sm:w-[340px] sm:translate-x-0 sm:p-6 lg:-left-6"
              style={{ animation: "floatSide 5.8s ease-in-out infinite" }}
            >
              <Sparkles
                className="mb-4 text-[#C9A84C]"
                size={24}
                strokeWidth={1.8}
              />

              <p
                className="text-[1.75rem] font-semibold leading-tight text-white sm:text-[2rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Honest. Clinical. Personal.
              </p>

              <p className="mt-3 max-w-xs text-base leading-7 text-white/62">
                A skincare space designed to help you understand your skin, not
                fear it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}