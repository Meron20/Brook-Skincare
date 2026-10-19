import PageHero from "../PageHero";
import AboutCtaSection from "./component/AboutCtasection";
import AboutHero from "./component/AboutHero";
import AboutStatsSection from "./component/AboutStatsSection";
import ExpertSection from "./component/ExpertSection";
import MissionVisionSection from "./component/MissionVisionSection";
import ValuesSection from "./component/ValuesSection";


export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5EF] text-[#232336]">
      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatSide {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-8px) translateY(-10px); }
        }
      `}</style>

     <PageHero
        label="About Brook"
        title="The Nurse Who Understands"
        highlight="Your Skin"
        description="A registered nurse and skin therapist bringing honest, science-based skincare guidance to Ethiopian and African skin."
        stats={[
          { value: "45K+", label: "YouTube Community" },
          { value: "8+", label: "Years Experience" },
          { value: "20K+", label: "Skin Journeys" },
        ]}
      />
      <AboutHero/>
      <MissionVisionSection />
      <ExpertSection />
      <ValuesSection />
      <AboutCtaSection />
    </main>
  );
}