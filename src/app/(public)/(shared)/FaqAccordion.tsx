"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
};

export default function FaqAccordion() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Load the FAQs from the admin
  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.faqs || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#C9A84C", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
        No questions yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => {
        const isOpen = openFaq === faq._id;

        return (
          <div
            key={faq._id}
            className="rounded-2xl overflow-hidden transition-all duration-300 text-left"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: isOpen
                ? "1px solid rgba(201,168,76,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Question */}
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : faq._id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span
                className="font-medium pr-4 text-sm"
                style={{ color: isOpen ? "#C9A84C" : "white" }}
              >
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className="flex-shrink-0 transition-transform duration-300"
                style={{
                  color: "#C9A84C",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Answer */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isOpen ? "300px" : "0px",
                opacity: isOpen ? 1 : 0,
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
        );
      })}
    </div>
  );
}