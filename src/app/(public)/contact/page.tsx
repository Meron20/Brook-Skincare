import ContactHero from "./ContactHero";
import ContactFormSection from "./ContactFormSection";
import StatsSection from "./StatsSection";
import FaqSection from "./FaqSection";
import ContactCta from "./ContactCta";

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5EF] text-[#232336]">
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(22px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.16); opacity: 0.78; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatSide {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-8px) translateY(-10px); }
        }
      `}</style>

      <ContactHero />
      <ContactFormSection />
      <StatsSection />
      <FaqSection />
      <ContactCta />
    </main>
  );
}