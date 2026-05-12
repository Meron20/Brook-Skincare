"use client";

import { CheckCircle } from "lucide-react";

export default function ExpertPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-[#C9A84C]/15 bg-white/[0.04] p-5 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/35 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(201,168,76,0.12)]">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[#071F14]">
        <CheckCircle size={20} strokeWidth={2} />
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-white/60">{text}</p>
      </div>
    </div>
  );
}