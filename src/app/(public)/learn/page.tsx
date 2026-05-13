"use client";

import { useEffect, useState, useRef } from "react";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import YouTubeSection from "@/components/public/learn/YouTubeSection";
import ArticlesSection from "@/components/public/learn/ArticlesSection";

type Article = {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage: string;
    isPinned: boolean;
    createdAt: string;
  };

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
};

const categoryColors: Record<string, string> = {
  general: "#818cf8",
  melasma: "#C9A84C",
  ingredients: "#34d399",
  routines: "#f472b6",
  spf: "#fb923c",
};

const CATEGORIES = ["all", "melasma", "ingredients", "routines", "spf", "general"];

export default function LearnPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
 

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then(r => r.json()),
      fetch("/api/faq").then(r => r.json()),
    ]).then(([articlesData, faqData]) => {
      setArticles(articlesData.articles || []);
      setFaqs(faqData.faqs || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

 
  return (
    <main>

      {/* ── HERO ── */}
      <section
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: "#0A1F14" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 90% 20%, rgba(74,144,164,0.05) 0%, transparent 50%)
            `,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 pointer-events-none hidden lg:block">
          {[500, 350, 200].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${-80 + i * 40}px`,
                right: `${-80 + i * 40}px`,
                border: "1px solid rgba(201,168,76,0.08)",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease",
            }}
          >
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: "#C9A84C" }}
            >
              Knowledge Hub
            </span>

            <h1
              className="font-light text-white mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.1,
              }}
            >
              Learn from{" "}
              <strong
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Brook
              </strong>
            </h1>

            <p
              className="text-base max-w-2xl mx-auto mb-10"
              style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}
            >
              Science-based skincare education for melanin-rich skin.
              Written by a registered nurse and melasma specialist
              with 8 years of clinical experience.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {[
                { value: `${articles.length}+`, label: "Articles" },
                { value: "45K+", label: "YouTube Subscribers" },
                { value: "8yr", label: "Clinical Experience" },
                { value: "Free", label: "Always" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p
                    className="font-bold mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2rem",
                      color: "#C9A84C",
                    }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </section>


      
         <ArticlesSection articles={articles} />

      {/* ── FAQ SECTION ── */}
      {!isLoading && faqs.length > 0 && (
        <section
          className="py-24 relative overflow-hidden"
          style={{ backgroundColor: "#0A1F14" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)",
            }}
          />

          <div className="max-w-3xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-14">
              <span
                className="text-xs font-semibold tracking-widest uppercase mb-3 block"
                style={{ color: "#C9A84C" }}
              >
                Got Questions?
              </span>
              <h2
                className="font-light text-white mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                Frequently Asked{" "}
                <strong
                  className="font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Questions
                </strong>
              </h2>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
              >
                Everything you need to know before booking your consultation.
              </p>
            </div>

            {/* FAQ accordion */}
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={faq._id}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: openFaq === faq._id
                      ? "1px solid rgba(201,168,76,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenFaq(openFaq === faq._id ? null : faq._id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span
                      className="font-medium pr-4 text-sm"
                      style={{ color: openFaq === faq._id ? "#C9A84C" : "white" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className="flex-shrink-0 transition-transform duration-300"
                      style={{
                        color: "#C9A84C",
                        transform: openFaq === faq._id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Answer */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openFaq === faq._id ? "300px" : "0px",
                      opacity: openFaq === faq._id ? 1 : 0,
                    }}
                  >
                    <p
                      className="px-6 pb-5 text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── YOUTUBE SECTION ── */}
   
      <YouTubeSection />
      
      {/* ── BOTTOM CTA ── */}
      <section
        className="py-16"
        style={{ backgroundColor: "#0A1F14" }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Ready to get personalised advice for your skin?
          </p>
          <Link
            href="/booking/slot"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              color: "#0A1F14",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            Book a Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </main>
  );
}