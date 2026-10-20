import { stats } from "./about.data";

export default function AboutStatsSection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* Soft gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center py-8 px-6 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <p
                className="font-bold mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  color: "#C9A84C",
                }}
              >
                {stat.value}
              </p>

              <p className="text-sm font-medium text-white">
                {stat.label}
              </p>

              <p
                className="text-xs mt-1 max-w-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}