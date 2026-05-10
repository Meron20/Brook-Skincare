import ServicesHero from "@/components/public/services/ServicesHero";
import ServicesList from "@/components/public/services/ServicesList";
import HowItWorks from "@/components/public/services/HowItWorks";
import ServicesCTA from "@/components/public/services/ServiceCTA";
import PackagesSection from "@/components/public/services/PackagesSection";

export default function ServicesPage() {
  return (
    <main>
       <ServicesHero />
       <ServicesList />
       <PackagesSection />
       <HowItWorks />
      <ServicesCTA />
    </main>
  );
}