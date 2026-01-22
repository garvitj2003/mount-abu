"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define the shape of a route based on data.js
interface TrekRoute {
    id: string;
    title: string;
    description: string;
    images: {
        main: string;
        gallery: string[];
    };
    // slug is not explicitly in the route object in trekGroups, 
    // but the ID is "trek-..." which might be used or I might need to generate a slug?
    // Wait, the user request implied navigating to /treks/[slug].
    // The data in trekGroups does NOT have a 'slug' field for routes in the snippet provided earlier.
    // However, the main destinations DO.
    // Let's check the data.js snippet again.
    // The trekGroups routes have 'id' but no 'slug'. 
    // I should probably use the ID as the slug or generate one.
    // The previous prompt's code used `dest.slug` for destinations.
    // For treks, I might need to add slugs to data.js or use IDs.
    // Let's assume for now I'll use the ID as the slug if slug is missing, 
    // or I'll check if I should update data.js.
    // Actually, looking at the previous turn, the user asked to redirect using slugs.
    // I'll assume I should use ID or add slugs. 
    // For safety, I'll use ID if slug is missing.
    slug?: string;
}

interface TrekOtherRoutesSectionProps {
    routes: TrekRoute[]; 
    currentTrekId: string;
}

interface TrailCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  slug: string;
}

function TrailCard({ imageSrc, title, subtitle, slug }: TrailCardProps) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(`/treks/${slug}`)} // Redirect to /treks/
      className="flex flex-col gap-4 w-[350px] md:w-[379px] shrink-0 cursor-pointer"
    >
        {/* Card Container */}
        <div className="flex flex-col w-full bg-[#FFFBF1] rounded-[40px] overflow-hidden pb-8 transition-transform hover:scale-[1.02] duration-300">
            {/* Image Collage */}
            <div className="relative w-full h-[292px] px-4 pt-4">
                <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                    <Image 
                        src={imageSrc || "/images/placeholder.jpg"} 
                        alt={title} 
                        fill 
                        className="object-cover"
                    />
                </div>
            </div>
            
            {/* Content */}
            <div className="flex flex-col items-start gap-3 mt-4 px-8">
                <h3 className="font-montserrat font-bold text-[27px] leading-tight text-[#2E2E30] uppercase text-left line-clamp-1">
                    {title}
                </h3>
                
                <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 text-[#9CA6B0]">
                    <div className="flex items-center">
                        <span className="font-montserrat font-medium text-[20px]">{subtitle}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default function TrekOtherRoutesSection({ routes, currentTrekId }: TrekOtherRoutesSectionProps) {
  // Filter out the current trek
  const otherRoutes = routes.filter(r => r.id !== currentTrekId);

  if (otherRoutes.length === 0) return null;

  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-16 md:mt-24 mb-24">
      <div className="w-full max-w-[1276px] flex flex-col gap-8">
        <h2 className="font-baron font-bold text-[24px] leading-[1.4] text-[#5B5036]">
          More Treks Nearby
        </h2>

        {/* Horizontal Scroll Container */}
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
                {otherRoutes.map((route) => {
                    // Fallback for missing images
                    const image = route.images?.main || route.images?.gallery?.[0] || "";
                    // Use ID as slug if slug property doesn't exist (it doesn't in the provided snippet)
                    const slug = route.id; 

                    return (
                        <TrailCard 
                            key={route.id}
                            imageSrc={image}
                            title={route.title}
                            subtitle="Nearby Route"
                            slug={slug}
                        />
                    );
                })}
            </div>
        </div>
      </div>
    </section>
  );
}
