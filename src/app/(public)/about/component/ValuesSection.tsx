"use client";

import {
  ShieldCheck,
  BookOpen,
  Users,
} from "lucide-react";

import ValueCard from "./ValueCard";

export default function ValuesSection() {
  return (
    <section className="px-4 py-16 sm:px-5 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          <ValueCard
            icon={<ShieldCheck size={26} strokeWidth={1.8} />}
            title="Safe guidance"
            text="Practical recommendations designed to protect your skin barrier and reduce confusion."
          />

          <ValueCard
            icon={<BookOpen size={26} strokeWidth={1.8} />}
            title="Education first"
            text="You learn why something works, when to use it, and what to avoid."
          />

          <ValueCard
            icon={<Users size={26} strokeWidth={1.8} />}
            title="For our community"
            text="Made for Ethiopian and African skin concerns that are often overlooked."
          />
        </div>
      </div>
    </section>
  );
}