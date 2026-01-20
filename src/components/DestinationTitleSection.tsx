"use client";

import React from "react";
import { Share2, Heart } from "lucide-react";
import { motion } from "motion/react";

interface DestinationTitleSectionProps {
  title: string;
  description: string;
}

export default function DestinationTitleSection({
  title,
  description,
}: DestinationTitleSectionProps) {
  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-10 md:mt-16">
      <div className="w-full max-w-[1276px] flex flex-col gap-[27px]">
        {/* Header Row: Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0">
          <h1 className="font-baron font-bold text-[32px] md:text-[40px] leading-[1.05] text-[#5B5036]">
            {title}
          </h1>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
             <button className="hover:opacity-70 transition-opacity">
                <Share2 size={24} color="#000000" />
             </button>
             <button className="hover:opacity-70 transition-opacity">
                <Heart size={24} color="#000000" />
             </button>
          </div>
        </div>

        {/* Description Text */}
        <p className="font-montserrat font-medium text-[18px] md:text-[24px] leading-[1.2] md:leading-[1.125] text-black max-w-[1269px]">
          {description}
        </p>
      </div>
    </section>
  );
}
