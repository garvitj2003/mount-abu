import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import AdventuresSection from "@/components/AdventuresSection";
import HiddenPlacesSection from "@/components/HiddenPlacesSection";
import AboutSection from "@/components/AboutSection";
import CityProfileSection from "@/components/CityProfileSection";
import ServicesSection from "@/components/ServicesSection";
import Tenders from "@/components/Tenders";
import ContactDirectorySection from "@/components/ContactDirectorySection";
import AppDownloadSection from "@/components/AppDownloadSection";
import ConnectSection from "@/components/ConnectSection";
import NewsUpdatesSection from "@/components/NewsUpdatesSection";
import InformationGuidlines from "@/components/InformationGuidlines";
import Testimonials from "@/components/Testimonals";

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <DestinationsSection />
            <AdventuresSection />
            <HiddenPlacesSection />
            <AboutSection />
            <CityProfileSection />
            <NewsUpdatesSection />
            <ServicesSection />
            <InformationGuidlines />
            <Tenders />
            <Testimonials/>
            <ContactDirectorySection />
            <AppDownloadSection />
            <ConnectSection />
        </main>
    );
}
