"use client";

import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import DestinationTitleSection from "@/components/DestinationTitleSection";
import DestinationDetailSection from "@/components/DestinationDetailSection";
import DestinationGuidelinesSection from "@/components/DestinationGuidelinesSection";
import DestinationMapSection from "@/components/DestinationMapSection";
import DestinationOtherTrailsSection from "@/components/DestinationOtherTrailsSection";

export default function DestinationDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  // Static data from design (Node 183:5884)
  const title = "Dilwara Jain Temple";
  const description =
    "Renowned for their stunning white marble craftsmanship, these Jain temples from the 11th–13th centuries showcase awe-inspiring carvings, domes, and pillars that reflect India’s architectural brilliance.";

  // Static data for Detail Section (Node 1375:15088)
  const detailTitle = "Trail Details";
  const detailDescription =
    "The Dilwara Temples were built between the 11th and 13th centuries by Jain ministers Vimal Shah n and Tejapala. Vimal Vasahi was constructed in 1031 CE by Vimal Shah, a minister of Bhima I, the Solanki king of Gujarat. Luna Vasahi was built in 1230 CE by Tejapala and his brother Vastupal, ministers of Vastupal, the prime minister of Gujarat. The temples are renowned for their intricate marble carvings, domes, and pillars, showcasing the pinnacle of Jain artistry. The complex includes Pittalhar, Parshvanath, and Mahavir Swami temples, each with unique architectural features and historical significance. The temples have been a center of Jain pilgrimage and cultural heritage for centuries.";
  const detailImage = "/images/destinations/dilwara-detail.png";

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col">
      <NavigationHeader variant="light" />
      
      <main className="flex-grow flex flex-col items-center pt-20 md:pt-24 pb-20">
        <DestinationTitleSection title={title} description={description} />
        <DestinationDetailSection 
          title={detailTitle} 
          description={detailDescription} 
          imageSrc={detailImage} 
        />
        <DestinationGuidelinesSection />
        <DestinationMapSection />
        <DestinationOtherTrailsSection />
      </main>

      <Footer />
    </div>
  );
}
