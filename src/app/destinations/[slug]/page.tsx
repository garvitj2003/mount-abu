import React from "react";
import { notFound } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import DestinationTitleSection from "@/components/DestinationTitleSection";
import DestinationDetailSection from "@/components/DestinationDetailSection";
import DestinationGuidelinesSection from "@/components/DestinationGuidelinesSection";
import DestinationMapSection from "@/components/DestinationMapSection";
import DestinationOtherTrailsSection from "@/components/DestinationOtherTrailsSection";
import AnimatedSection from "@/components/AnimatedSection";
import { destinations } from "@/data/data";

// Helper to find destination by slug
function findDestination(slug: string) {
  // 1. Search in main destinations
  const mainDest = destinations.find((d) => d.slug === slug);
  return mainDest;
}

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = findDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col">
      <NavigationHeader variant="light" />
      
      <main className="flex-grow flex flex-col items-center pt-20 md:pt-24 pb-20 w-full">
        <AnimatedSection>
          <DestinationTitleSection 
            title={destination.title} 
            description={destination.description} 
          />
        </AnimatedSection>
        
        {destination.details && (
          <AnimatedSection delay={0.1}>
            <DestinationDetailSection 
              title={destination.details.heading} 
              description={destination.details.text} 
              imageSrc={destination.details.images?.main || ""} 
            />
          </AnimatedSection>
        )}

        {/* 
            Some destinations might not have guidelines in the data snippet (e.g. treks if we supported them fully), 
            but the main destinations do. 
            We check if guidelines exist.
        */}
        {destination.guidelines && (
          <AnimatedSection delay={0.2}>
            <DestinationGuidelinesSection guidelines={destination.guidelines} />
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.3}>
          <DestinationMapSection />
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <DestinationOtherTrailsSection />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
