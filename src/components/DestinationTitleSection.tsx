"use client";

import React, { useState } from "react";
import { Share2, Heart, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DestinationTitleSectionProps {
  title: string;
  description: string;
}

export default function DestinationTitleSection({
  title,
  description,
}: DestinationTitleSectionProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-10 md:mt-16">
      <div className="w-full max-w-[1276px] flex flex-col gap-[27px]">
        {/* Header Row: Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0">
          <h1 className="font-baron font-bold text-[32px] md:text-[40px] leading-[1.05] text-[#5B5036]">
            {title}
          </h1>

          {/* Action Buttons */}
          <div className="relative flex items-center gap-6">
             <button 
               onClick={handleShare}
               className="hover:opacity-70 transition-opacity p-2 -ml-2 rounded-full hover:bg-black/5 cursor-pointer"
               aria-label="Share"
             >
                <Share2 size={24} color="#000000" />
             </button>
             <button className="hover:opacity-70 transition-opacity p-2 -ml-2 rounded-full hover:bg-black/5 cursor-pointer">
                <Heart size={24} color="#000000" />
             </button>

             {/* Toast Notification */}
             <AnimatePresence>
               {showToast && (
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.9 }}
                   className="absolute top-14 left-0 z-50 bg-[#132019] text-[#d4af37] px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 whitespace-nowrap border border-[#d4af37]/20 cursor-default"
                 >
                   <Check size={16} />
                   <span className="font-montserrat text-sm font-medium">Link copied</span>
                 </motion.div>
               )}
             </AnimatePresence>
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
