"use client";

export default function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[1.75rem] border border-[#C9A84C]/20 bg-[#071F14] p-6 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-[0_0_45px_rgba(201,168,76,0.14)] md:rounded-[2rem] md:p-7">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 text-[#C9A84C] transition duration-500 group-hover:scale-105 group-hover:bg-[#C9A84C]/20">
        {icon}
      </div>

      <h3
        className="text-3xl font-semibold text-white"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </h3>

      <p className="mt-3 leading-7 text-white/60">{text}</p>
    </div>
  );
}