import BookSection from "@/components/public/BookSection";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import MarqueeSection from "@/components/public/MarqueeSection";
import PillarsSection from "@/components/public/PillarsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import TransformationSection from "@/components/public/TransformationSection";


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <TransformationSection/>
      <MarqueeSection/>
      <TestimonialsSection/>
      <BookSection/>
    </main>
  );
}