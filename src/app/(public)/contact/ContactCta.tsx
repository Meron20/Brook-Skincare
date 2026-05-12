import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";

export default function ContactCta() {
  return (
    <section className="px-4 py-16 sm:px-5 md:px-8 md:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#C9A84C]/20 bg-gradient-to-br from-[#071F14] to-[#0E2A1E] p-6 shadow-2xl shadow-[#071F14]/20 sm:p-8 md:rounded-[2.5rem] md:p-12">
        <Image
          src="/brook-logo.jpeg"
          alt="Brook Skincare background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071F14]/95 via-[#071F14]/88 to-[#0E2A1E]/92" />
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
              Start your journey to healthier, glowing skin with expert online
              consultations tailored to your skin concerns.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row md:flex-col md:items-start">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] px-8 py-4 font-semibold text-[#071F14] shadow-xl shadow-[#C9A84C]/20 transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(201,168,76,0.24)]"
            >
              Book consultation
              <ArrowRight size={20} strokeWidth={1.8} />
            </Link>

            <span className="flex items-center gap-2 text-sm text-white/45">
              <Lock size={16} strokeWidth={1.8} />
              Secure booking
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}