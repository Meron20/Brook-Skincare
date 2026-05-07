"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import { contactItems } from "./contact.data";

export default function ContactHero() {
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

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          className="relative"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
            transition: "all 850ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#C9A84C]/60 bg-[#071F14] p-5 shadow-2xl shadow-[#071F14]/25 transition-all duration-700 hover:shadow-[0_0_55px_rgba(201,168,76,0.15)] sm:p-7 md:rounded-[2rem] md:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(201,168,76,0.22),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.08),transparent_30%)]" />

            <div className="relative z-10">
              <div className="relative mx-auto mb-8 h-52 overflow-hidden rounded-[2rem] border border-[#C9A84C]/25 bg-black shadow-2xl shadow-black/25 sm:h-64 md:h-72">
                <Image
                  src="/brook-logo.jpeg"
                  alt="Brook Skincare"
                  fill
                  priority
                  className="object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071F14] via-[#071F14]/25 to-transparent" />

                <div
                  className="absolute bottom-4 left-4 right-4 rounded-3xl border border-[#C9A84C]/20 bg-[#071F14]/78 p-4 backdrop-blur-xl"
                  style={{ animation: "floatSoft 5.5s ease-in-out infinite" }}
                >
                  <Sparkles
                    className="mb-2 text-[#C9A84C]"
                    size={24}
                    strokeWidth={1.8}
                  />
                  <p
                    className="text-2xl font-semibold text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Reach Us Anytime
                  </p>
                  <p className="mt-1 text-sm leading-5 text-white/60">
                    Private skincare guidance, worldwide consultations and
                    confidential support.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {contactItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group block rounded-2xl border border-[#C9A84C]/15 bg-white/[0.04] p-4 transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/40 hover:bg-white/[0.08] hover:shadow-[0_0_35px_rgba(201,168,76,0.12)] focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/20"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 text-[#C9A84C] transition duration-500 group-hover:scale-105 group-hover:bg-[#C9A84C]/20">
                      {item.icon}
                    </div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-white/45">
                      {item.text}
                    </p>
                  </a>
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
                24h
              </p>
              <div>
                <p className="font-semibold text-[#232336]">
                  Average response
                </p>
                <p className="text-sm text-[#232336]/60">
                  Monday to Friday, worldwide
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
            Contact Brook
          </p>

          <h1
            className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:mx-0 lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Get in Touch with Brook Skincare
          </h1>

          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-7 text-[#343454]/80 md:text-lg md:leading-8 lg:mx-0">
            <p>
              Have a question about your skin, your routine, or online
              consultations? Send a message and we’ll guide you with calm,
              honest, personalised support.
            </p>

            <p>
              Every message is handled confidentially. Whether you are dealing
              with dryness, acne, melasma, hyperpigmentation, or simply need
              clarity, this is a safe place to start.
            </p>

            <p>
              <strong>By a nurse. For your skin. Built for you.</strong>
            </p>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap lg:justify-start">
            <a
              href="#contact-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] px-8 py-4 font-semibold text-[#071F14] shadow-xl shadow-[#C9A84C]/20 transition duration-500 hover:-translate-y-0.5"
            >
              Send a Message
              <ArrowRight size={20} strokeWidth={1.8} />
            </a>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#071F14]/10 bg-white/50 px-8 py-4 font-semibold text-[#232336] backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:bg-white"
            >
              <Stethoscope
                size={20}
                strokeWidth={1.8}
                className="text-[#C9A84C]"
              />
              Book Consultation
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#071F14]/10 bg-white/50 px-8 py-4 font-semibold text-[#232336] backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:bg-white"
            >
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