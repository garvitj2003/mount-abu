import React from "react";
import { notFound } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import DestinationTitleSection from "@/components/DestinationTitleSection";
import DestinationDetailSection from "@/components/DestinationDetailSection";
import DestinationMapSection from "@/components/DestinationMapSection";
import TrekOtherRoutesSection from "@/components/TrekOtherRoutesSection";
import AnimatedSection from "@/components/AnimatedSection";
import { trekGroups } from "@/data/data";

// Helper to find trek by slug (using ID as slug)
function findTrek(slug: string) {
  for (const group of trekGroups) {
    const route = group.routes.find((r) => r.id === slug);
    if (route) {
      return { route, group };
    }
  }
  return null;
}

export default async function TrekDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = findTrek(slug);

  if (!result) {
    notFound();
  }

  const { route, group } = result;
  
  const fallbackImage = "/images/destination/trail-card-collage.png";
  const mainImage = route.images?.main || route.images?.gallery?.[0] || fallbackImage;

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col">
      <NavigationHeader variant="light" />
      
      <main className="flex-grow flex flex-col items-center pt-20 md:pt-24 pb-20 w-full">
        <AnimatedSection>
          <DestinationTitleSection 
            title={route.title} 
            description={route.description} 
          />
        </AnimatedSection>
        
        {/* Using DestinationDetailSection to display the image and re-emphasize the route info */}
        <AnimatedSection delay={0.1}>
          <DestinationDetailSection 
            title={`Starting from ${group.startPoint}`} 
            description={route.description} 
            imageSrc={mainImage} 
          />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <DestinationMapSection />
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <TrekOtherRoutesSection routes={group.routes} currentTrekId={route.id} />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
