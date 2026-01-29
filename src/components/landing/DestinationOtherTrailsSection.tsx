"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { topDestinations } from "@/data/data";

interface TrailCardProps {
  imageSrc: string;
  title: string;
  trekName: string;
  distance: string;
  guideInfo: string;
  slug: string;
}

function TrailCard({ imageSrc, title, trekName, distance, guideInfo, slug }: TrailCardProps) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(`/destinations/${slug}`)}
      className="flex flex-col gap-4 w-[350px] md:w-[379px] shrink-0 cursor-pointer"
    >
        {/* Card Container */}
        <div className="flex flex-col w-full bg-[#FFFBF1] rounded-[40px] overflow-hidden pb-8 transition-transform hover:scale-[1.02] duration-300">
            {/* Image Collage - Added rounded-[40px] and px-4 pt-4 to make it stand out with rounding on all corners */}
            <div className="relative w-full h-[292px] px-4 pt-4">
                <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                    <Image 
                        src={imageSrc} 
                        alt={title} 
                        fill 
                        className="object-cover"
                    />
                </div>
            </div>
            
            {/* Content - Changed to items-start and text-left */}
            <div className="flex flex-col items-start gap-3 mt-4 px-8">
                <h3 className="font-montserrat font-bold text-[27px] leading-tight text-[#2E2E30] uppercase text-left line-clamp-1">
                    {title}
                </h3>
                
                <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 text-[#9CA6B0]">
                    <div className="flex items-center gap-4 border-r-2 border-[#7F868C]/30 pr-4">
                        <span className="font-montserrat font-medium text-[20px]">{trekName}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-montserrat font-medium text-[20px]">{distance}</span>
                    </div>
                     <div className="w-full text-left">
                        <span className="font-montserrat font-medium text-[20px]">{guideInfo}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function DestinationOtherTrailsSection() {
  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-16 md:mt-24 mb-24">
      <div className="w-full max-w-[1276px] flex flex-col gap-8">
        <h2 className="font-baron font-bold text-[24px] leading-[1.4] text-[#5B5036]">
          More Destinations
        </h2>

        {/* Horizontal Scroll Container - Added style to hide scrollbar */}
        <div 
            className="w-full overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
            }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div className="flex flex-nowrap gap-10 md:gap-[60px]">
                {topDestinations.map((dest) => (
                    <TrailCard 
                        key={dest.id}
                        imageSrc={dest.details.images.main}
                        title={dest.title}
                        trekName="Top Rated"
                        distance="Mount Abu"
                        guideInfo="Must Visit"
                        slug={dest.slug}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
