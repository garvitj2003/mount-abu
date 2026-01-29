"use client";

import React from "react";
import Image from "next/image";

interface DestinationDetailProps {
  imageSrc: string;
  title: string;
  description: string;
}

export default function DestinationDetailSection({
  imageSrc,
  title,
  description,
}: DestinationDetailProps) {
  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-16 md:mt-24">
      {/* 
        Container Frame 2147239650
        Layout: Row, gap: 73px, alignItems: center
        Width: stretch (in context of parent max-width)
      */}
      <div className="w-full max-w-[1276px] flex flex-col md:flex-row items-center gap-10 md:gap-[73px]">
        {/* Left Image - Rectangle 7 */}
        <div className="relative w-full md:w-[608px] h-[300px] md:h-[540px] shrink-0 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Content - Description Frame */}
        <div className="flex flex-col justify-center gap-4 md:gap-[16px] w-full md:w-[588px]">
          {/* Title - Trail Details */}
          <h2 className="font-baron font-bold text-[24px] leading-[1.4] text-[#2D4A2D]">
            {title}
          </h2>

          {/* Description Text */}
          <div className="flex flex-col gap-2 w-full">
            <p className="font-montserrat font-medium text-[16px] md:text-[20px] leading-[1.6] md:leading-[1.22] text-black text-justify">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
