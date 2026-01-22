import React from "react";
import { notFound } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import DestinationTitleSection from "@/components/DestinationTitleSection";
import DestinationDetailSection from "@/components/DestinationDetailSection";
import DestinationMapSection from "@/components/DestinationMapSection";
import TrekOtherRoutesSection from "@/components/TrekOtherRoutesSection";
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
      
      <main className="flex-grow flex flex-col items-center pt-20 md:pt-24 pb-20">
        <DestinationTitleSection 
          title={route.title} 
          description={route.description} 
        />
        
        {/* Using DestinationDetailSection to display the image and re-emphasize the route info */}
        <DestinationDetailSection 
          title={`Starting from ${group.startPoint}`} 
          description={route.description} 
          imageSrc={mainImage} 
        />

        <DestinationMapSection />
        
        <TrekOtherRoutesSection routes={group.routes} currentTrekId={route.id} />
      </main>

      <Footer />
    </div>
  );
}
