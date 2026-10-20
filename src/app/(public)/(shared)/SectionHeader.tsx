type SectionHeaderProps = {
  label: string;
  title: string;
  highlight: string;
  description?: string;
  dark?: boolean;   // true on dark green backgrounds
  center?: boolean; // true to center the text
};

export default function SectionHeader({
  label,
  title,
  highlight,
  description,
  dark = false,
  center = false,
}: SectionHeaderProps) {
  return (
    <div className={center ? "text-center mx-auto max-w-2xl" : ""}>
      <span
        className="text-xs font-semibold tracking-widest uppercase mb-4 block"
        style={{ color: dark ? "#C9A84C" : "#9A7A2E" }}
      >
        {label}
      </span>

      <h2
        className="font-light mb-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          lineHeight: 1.15,
          color: dark ? "white" : "#0A1F14",
        }}
      >
        {title}{" "}
        <strong
          className="font-semibold"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {highlight}
        </strong>
      </h2>

      {description && (
        <p
          className="text-base"
          style={{
            color: dark ? "rgba(255,255,255,0.55)" : "rgba(10,31,20,0.6)",
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}