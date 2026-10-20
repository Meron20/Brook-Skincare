import Image from "next/image";
import { BookOpen, Sparkles } from "lucide-react";
import FaqAccordion from "../(shared)/FaqAccordion";

export default function FaqSection() {
  return (
    <section className="relative overflow-hidden bg-[#0D241B] py-24 text-white">
      <div className="absolute inset-0 bg-[#0D241B]/94" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#C9A84C]/10 blur-[110px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#C9A84C]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        {/* ── LEFT: image + floating card (same design, smaller sizes) ── */}
        <div className="relative mx-auto min-h-[460px] w-full max-w-[440px] lg:max-w-none ">
         <div
            className="absolute right-0 top-0 h-[460px] w-full overflow-hidden rounded-3xl border border-[#C9A84C]/25 px-10 py-14 shadow-2xl shadow-black/25 lg:w-[400px]"
            style={{ background: "linear-gradient(135deg, #0F2D1E, #0A1F14)" }}
          >
            {/* Gold top line */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }}
            />

            <div className="relative w-full h-full">
              <Image
                src="/brook-book.jpeg"
                alt="Brook Skincare book"
                fill
                className="object-contain rounded-xl transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
          </div>

          <div
            className="absolute bottom-6 left-1/2 z-20 w-[88%] -translate-x-1/2 rounded-2xl border border-[#C9A84C]/20 bg-[#071F14]/85 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-700 hover:border-[#C9A84C]/45 hover:bg-[#071F14]/92 sm:left-0 sm:w-[280px] sm:translate-x-0 lg:-left-6"
            style={{ animation: "floatSide 5.8s ease-in-out infinite" }}
          >
            <BookOpen className="mb-3 text-[#C9A84C]" size={18} strokeWidth={1.8} />

            <p
              className="text-xl font-semibold leading-tight text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Questions before booking?
            </p>

            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Learn what to expect before starting your skincare journey.
            </p>
          </div>
        </div>

        {/* ── RIGHT: heading + FAQs from the admin ── */}
        <div className="text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            <Sparkles size={14} strokeWidth={1.8} />
            FAQ
          </div>

          <h2
            className="mx-auto max-w-4xl font-semibold leading-tight tracking-tight text-white mb-8 lg:mx-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
            }}
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#F4D87A] bg-clip-text text-transparent">
              questions
            </span>
          </h2>

          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}