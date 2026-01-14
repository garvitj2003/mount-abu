import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import AdventuresSection from "@/components/AdventuresSection";
import HiddenPlacesSection from "@/components/HiddenPlacesSection";
import AboutSection from "@/components/AboutSection";
import CityProfileSection from "@/components/CityProfileSection";
import ServicesSection from "@/components/ServicesSection";
import ContactDiarySection from "@/components/ContactDiarySection";
import ContactDirectorySection from "@/components/ContactDirectorySection";
import AppDownloadSection from "@/components/AppDownloadSection";
import ConnectSection from "@/components/ConnectSection";
import NewsUpdatesSection from "@/components/NewsUpdatesSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DestinationsSection />
      <AdventuresSection />
      <HiddenPlacesSection />
      <AboutSection />
      <CityProfileSection />
      <ServicesSection />
      <ContactDiarySection />
      <ContactDirectorySection />
      <AppDownloadSection />
      <ConnectSection />
      <NewsUpdatesSection />
    </main>
  );
}
