"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { missionVision } from "./about.data";

export default function MissionVisionSection() {
  return (
    <section className="relative px-4 py-16 sm:px-5 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A84C]">
              Where Brook Skincare Is Heading
            </p>

            <h2
              className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Clear skincare education made for real people and real skin.
            </h2>

            <div className="mt-9 space-y-5">
              {missionVision.map(({ title, text, icon: Icon }) => (
                <div
                  key={title}
                  className="group rounded-[1.75rem] border border-[#071F14]/10 bg-[#FFF7F0] p-5 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-[0_0_45px_rgba(201,168,76,0.12)] sm:p-7 md:rounded-[2rem]"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071F14] text-[#C9A84C]">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3
                    className="text-3xl font-semibold text-[#5D3434]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {title}
                  </h3>

                  <p className="mt-3 max-w-2xl leading-7 text-[#343454]/65">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto min-h-[520px] w-full max-w-[520px] overflow-visible sm:min-h-[560px] lg:max-w-none">
            <div className="absolute right-0 top-0 h-[430px] w-full overflow-hidden rounded-[2.25rem] border border-[#C9A84C]/25 bg-[#071F14] shadow-2xl shadow-[#071F14]/20 sm:h-[520px] sm:rounded-[3rem] lg:w-[420px]">
              <Image
                src="/brook-book.jpeg"
                alt="Brook Skincare"
                fill
                className="object-cover opacity-90 transition-transform duration-[1200ms] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071F14]/75 via-[#071F14]/10 to-transparent" />
            </div>

            <div
              className="absolute bottom-5 left-1/2 z-20 w-[88%] -translate-x-1/2 rounded-3xl border border-[#C9A84C]/20 bg-[#071F14]/85 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-[#C9A84C]/45 hover:bg-[#071F14]/92 sm:bottom-6 sm:left-0 sm:w-[360px] sm:translate-x-0 sm:p-6 lg:-left-6"
              style={{ animation: "floatSide 5.8s ease-in-out infinite" }}
            >
              <Sparkles
                className="mb-4 text-[#C9A84C]"
                size={26}
                strokeWidth={1.8}
              />

              <p
                className="text-2xl font-semibold text-white sm:text-3xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Honest. Clinical. Personal.
              </p>

              <p className="mt-3 max-w-xs leading-7 text-white/62">
                A skincare space designed to help you understand your skin,
                not fear it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}