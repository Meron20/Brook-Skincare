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
    <div
      className="group relative overflow-hidden rounded-2xl p-7 transition-all hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        background: "linear-gradient(135deg, #0F2D1E, #0A1F14)",
        border: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition group-hover:scale-105"
        style={{
          backgroundColor: "rgba(201,168,76,0.1)",
          border: "1px solid rgba(201,168,76,0.2)",
          color: "#C9A84C",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-semibold text-white mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </h3>

      {/* Text */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {text}
      </p>
    </div>
  );
}