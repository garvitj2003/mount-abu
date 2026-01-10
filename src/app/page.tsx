import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import AdventuresSection from "@/components/AdventuresSection";
import HiddenPlacesSection from "@/components/HiddenPlacesSection";
import AboutSection from "@/components/AboutSection";
import CityProfileSection from "@/components/CityProfileSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DestinationsSection />
      <AdventuresSection />
      <HiddenPlacesSection />
      <AboutSection />
      <CityProfileSection />
    </main>
  );
}
