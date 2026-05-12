import { stats } from "./contact.data";

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-[#071F14] px-4 py-16 sm:px-5 md:px-8 md:py-20">
      <div className="absolute inset-0 bg-[#071F14]/92" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-56 w-[680px] -translate-x-1/2 rounded-full bg-[#C9A84C]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {stats.map(({ icon, value, label }) => (
          <div
            key={label}
            className="rounded-[1.75rem] border border-[#C9A84C]/15 bg-white/[0.04] p-6 text-center backdrop-blur-xl transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/40 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(201,168,76,0.12)] md:rounded-[2rem] md:p-7"
          >
            <div className="mb-3 flex justify-center text-[#C9A84C]">
              {icon}
            </div>
            <p
              className="text-4xl font-semibold text-[#C9A84C] md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {value}
            </p>
            <p className="mt-2 font-semibold text-[#F8F5EF]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}