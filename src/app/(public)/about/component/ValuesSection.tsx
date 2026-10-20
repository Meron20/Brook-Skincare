import { ShieldCheck, BookOpen, Users } from "lucide-react";
import ValueCard from "./ValueCard";
import SectionHeader from "../../(shared)/SectionHeader";

export default function ValuesSection() {
  return (
    <section className="py-24" style={{ backgroundColor: "#F0F7F2" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <SectionHeader
            center
            label="What We Stand For"
            title="Our"
            highlight="Values"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ValueCard
            icon={<ShieldCheck size={20} strokeWidth={1.8} />}
            title="Safe guidance"
            text="Practical recommendations designed to protect your skin barrier and reduce confusion."
          />

          <ValueCard
            icon={<BookOpen size={20} strokeWidth={1.8} />}
            title="Education first"
            text="You learn why something works, when to use it, and what to avoid."
          />

          <ValueCard
            icon={<Users size={20} strokeWidth={1.8} />}
            title="For our community"
            text="Made for Ethiopian and African skin concerns that are often overlooked."
          />
        </div>
      </div>
    </section>
  );
}