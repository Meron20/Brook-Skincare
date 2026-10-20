import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../../(shared)/SectionHeader";


export default function AboutCtaSection() {
  return (
    <section className="py-24" style={{ backgroundColor: "#F0F7F2" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-10 md:p-14"
          style={{
            background: "linear-gradient(135deg, #0F2D1E, #0A1F14)",
            border: "1px solid rgba(201,168,76,0.3)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.2)",
          }}
        >
          {/* Gold top line */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)" }}
          />

          {/* Soft gold glow */}
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full pointer-events-none"
            style={{ backgroundColor: "rgba(201,168,76,0.1)", filter: "blur(90px)" }}
          />

          <div className="relative z-10 grid gap-8 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
            <SectionHeader
              dark
              label="Personalised Skincare"
              title="Ready for"
              highlight="Radiant and Healthy Skin?"
              description="Book your personalised skincare session today and discover your natural glow."
            />

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                color: "#0A1F14",
                boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
              }}
            >
              Book a Consultation
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}