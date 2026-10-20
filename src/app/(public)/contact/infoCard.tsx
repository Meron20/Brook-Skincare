export default function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#071F14]/10 bg-[#FFF7F0] p-5 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-[0_0_45px_rgba(201,168,76,0.12)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#071F14] text-[#C9A84C]">
        {icon}
      </div>

      <h3
        className="text-xl font-semibold text-[#0A1F14]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[#343454]/70">
        {text}
      </p>
    </div>
  );
}