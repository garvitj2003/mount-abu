"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Map component to avoid SSR issues and "pause initial render"
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#FFE9BE66] animate-pulse rounded-2xl">
      <Loader2 className="w-10 h-10 text-[#5B5036] animate-spin" />
    </div>
  ),
});

export default function DestinationMapSection() {
  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-10 md:mt-16 mb-20">
      <div className="w-full max-w-[1276px] flex flex-col gap-6">
        <h2 className="font-baron font-bold text-[24px] leading-[1.4] text-[#5B5036]">
          Direction
        </h2>

        {/* Map Container - Width 730px from Figma (approx 60% of 1276px) */}
        <div className="w-full md:w-[730px] h-[400px] md:h-[421px] rounded-2xl overflow-hidden shadow-lg relative bg-[#FFE9BE66]">
            <MapComponent />
        </div>
      </div>
    </section>
  );
}
