"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Tag } from "lucide-react";

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

const categoryColors: Record<string, string> = {
  general: "#818cf8",
  melasma: "#C9A84C",
  ingredients: "#34d399",
  routines: "#f472b6",
  spf: "#fb923c",
};

const CATEGORIES = ["all", "melasma", "ingredients", "routines", "spf", "general"];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-SE", {
    day: "numeric", month: "long", year: "numeric",
  });

export default function ArticlesSection({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Set first article as selected by default
  useEffect(() => {
    if (articles.length > 0 && !selectedArticle) {
      setSelectedArticle(articles[0]);
    }
  }, [articles]);

  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  // Update selected if filtered out
  useEffect(() => {
    if (filteredArticles.length > 0) {
      setSelectedArticle(filteredArticles[0]);
    } else {
      setSelectedArticle(null);
    }
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div
          className="mb-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ color: "#9A7A2E" }}
          >
            Articles
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#0A1F14",
                lineHeight: 1.1,
              }}
            >
              Learn from{" "}
              <strong
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Brook
              </strong>
            </h2>

            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200"
                  style={{
                    background: activeCategory === cat
                      ? "linear-gradient(135deg, #C9A84C, #9A7A2E)"
                      : "white",
                    color: activeCategory === cat
                      ? "#0A1F14"
                      : "rgba(10,31,20,0.55)",
                    border: activeCategory === cat
                      ? "none"
                      : "1px solid rgba(10,31,20,0.1)",
                    boxShadow: activeCategory === cat
                      ? "0 4px 12px rgba(201,168,76,0.3)"
                      : "none",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── EMPTY ── */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p style={{ color: "rgba(10,31,20,0.4)" }}>
              No articles in this category yet.
            </p>
          </div>
        )}

        {/* ── MASTER DETAIL LAYOUT ── */}
        {filteredArticles.length > 0 && (
          <div
            className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 8px 40px rgba(10,31,20,0.08)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >

            {/* ── LEFT — Article List ── */}
            <div
              className="lg:col-span-2 flex flex-col overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #0A1F14, #1A3D2B)",
                borderRight: "1px solid rgba(201,168,76,0.15)",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              {/* List header */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#C9A84C" }}
                >
                  {filteredArticles.length} Article{filteredArticles.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Article list items */}
              {filteredArticles.map((article) => {
                const isSelected = selectedArticle?._id === article._id;
                const color = categoryColors[article.category] || "#C9A84C";

                return (
                  <button
                    key={article._id}
                    onClick={() => setSelectedArticle(article)}
                    className="w-full text-left transition-all duration-200 relative group"
                    style={{
                      padding: "16px 20px",
                      backgroundColor: isSelected
                        ? "rgba(201,168,76,0.1)"
                        : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Active left border */}
                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                        style={{
                          background: "linear-gradient(180deg, #C9A84C, #9A7A2E)",
                        }}
                      />
                    )}

                    {/* Hover bg */}
                    {!isSelected && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      />
                    )}

                    <div className="flex items-start gap-3 relative">
                      {/* Category color dot + initial */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{
                          backgroundColor: `${color}20`,
                          color,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "18px",
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {article.title.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Category */}
                        <span
                          className="text-xs font-medium capitalize"
                          style={{ color }}
                        >
                          {article.category}
                        </span>

                        {/* Title */}
                        <p
                          className="text-sm font-medium mt-0.5 line-clamp-2"
                          style={{
                            color: isSelected ? "white" : "rgba(255,255,255,0.75)",
                            lineHeight: 1.4,
                          }}
                        >
                          {article.title}
                        </p>

                        {/* Date */}
                        <p
                          className="text-xs mt-1.5 flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          <Clock size={10} />
                          {formatDate(article.createdAt)}
                        </p>
                      </div>

                      <ArrowRight
                        size={14}
                        className="flex-shrink-0 mt-1 transition-all duration-200"
                        style={{
                          color: isSelected ? "#C9A84C" : "rgba(255,255,255,0.2)",
                          transform: isSelected ? "translateX(2px)" : "translateX(-2px)",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── RIGHT — Article Detail ── */}
            <div
              className="lg:col-span-3 flex flex-col bg-white overflow-hidden"
              style={{ maxHeight: "600px" }}
            >
              {selectedArticle ? (
                <div className="flex flex-col h-full overflow-y-auto">

                  {/* Cover image */}
                  {selectedArticle.coverImage && (
                    <div className="flex-shrink-0 px-8 pt-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                        src={selectedArticle.coverImage}
                        alt={selectedArticle.title}
                        className="w-full object-contain rounded-2xl"
                        style={{
                            maxHeight: "220px",
                            border: "1px solid rgba(10,31,20,0.08)",
                        }}
                        />
                    </div>
                  )}
                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">

                    {/* Category + Date */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full capitalize"
                        style={{
                          backgroundColor: `${categoryColors[selectedArticle.category] || "#C9A84C"}15`,
                          color: categoryColors[selectedArticle.category] || "#C9A84C",
                          border: `1px solid ${categoryColors[selectedArticle.category] || "#C9A84C"}30`,
                        }}
                      >
                        <Tag size={10} />
                        {selectedArticle.category}
                      </span>

                      {selectedArticle.isPinned && (
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: "rgba(201,168,76,0.1)",
                            color: "#9A7A2E",
                            border: "1px solid rgba(201,168,76,0.25)",
                          }}
                        >
                          📌 Featured
                        </span>
                      )}

                      <span
                        className="flex items-center gap-1 text-xs ml-auto"
                        style={{ color: "rgba(10,31,20,0.4)" }}
                      >
                        <Clock size={11} />
                        {formatDate(selectedArticle.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      className="font-semibold mb-4"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        color: "#0A1F14",
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedArticle.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                      className="text-sm leading-relaxed mb-5 pb-5"
                      style={{
                        color: "rgba(10,31,20,0.65)",
                        borderBottom: "1px solid rgba(10,31,20,0.08)",
                        fontStyle: "italic",
                      }}
                    >
                      {selectedArticle.excerpt}
                    </p>

                    {/* Full content */}
                    <div
                      className="text-sm leading-relaxed flex-1"
                      style={{
                        color: "rgba(10,31,20,0.7)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedArticle.content}
                    </div>

                    {/* Bottom CTA */}
                    <div
                      className="mt-8 pt-6 flex items-center justify-between"
                      style={{ borderTop: "1px solid rgba(10,31,20,0.08)" }}
                    >
                      <p
                        className="text-xs"
                        style={{ color: "rgba(10,31,20,0.4)" }}
                      >
                        Written by Brook — Registered Nurse & Melasma Specialist
                      </p>
                      <Link
                        href="/booking/slot"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs transition-all hover:-translate-y-0.5 flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                          color: "#0A1F14",
                          boxShadow: "0 4px 12px rgba(201,168,76,0.3)",
                        }}
                      >
                        Book Consultation
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full py-20">
                  <p style={{ color: "rgba(10,31,20,0.3)" }}>
                    Select an article to read
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}