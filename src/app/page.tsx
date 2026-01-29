import HeroSection from "@/components/landing/HeroSection";
import DestinationsSection from "@/components/landing/DestinationsSection";
import AdventuresSection from "@/components/landing/AdventuresSection";
import HiddenPlacesSection from "@/components/landing/HiddenPlacesSection";
import AboutSection from "@/components/landing/AboutSection";
import CityProfileSection from "@/components/landing/CityProfileSection";
import ServicesSection from "@/components/landing/ServicesSection";
import Tenders from "@/components/landing/Tenders";
import ContactDirectorySection from "@/components/landing/ContactDirectorySection";
import AppDownloadSection from "@/components/landing/AppDownloadSection";
import ConnectSection from "@/components/landing/ConnectSection";
import NewsUpdatesSection from "@/components/landing/NewsUpdatesSection";
import InformationGuidlines from "@/components/landing/InformationGuidlines";
import Testimonials from "@/components/landing/Testimonals";
import Footer from "@/components/landing/Footer";

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
            <AppDownloadSection />
            <ConnectSection />
            <ContactDirectorySection />
            <Footer />
        </main>
    );
}
