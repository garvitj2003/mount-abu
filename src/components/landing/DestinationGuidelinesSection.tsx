"use client";

import React from "react";
import { DoorOpen, Info, Clock, Camera, User, Moon, CigaretteOff, PawPrint } from "lucide-react";

interface DestinationGuidelinesProps {
  guidelines: {
    entryFee: string;
    timings: string;
    photography: string;
    ageLimit: string;
    quietHours: string;
    smoking: string;
    pets: string;
    notes: string[];
  };
}

export default function DestinationGuidelinesSection({ guidelines }: DestinationGuidelinesProps) {
  return (
    <section className="w-full flex justify-center px-4 md:px-0 mt-16 md:mt-24">
      {/* Container Frame 2147239376 - Guidelines Section */}
      <div className="w-full max-w-[1276px] flex flex-col gap-9">
        
        {/* Title */}
        <h2 className="font-baron font-bold text-[24px] leading-[1.4] text-[#5B5036]">
          Guidelines
        </h2>

        {/* Policies List Frame 2147239100 */}
        <div className="flex flex-col w-full bg-[#FFE9BE66] rounded-[19px] overflow-hidden">
          
          {/* Policy Item 1: Entry Fee */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
            <div className="flex items-center gap-2 min-w-[200px]">
                <DoorOpen size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Entry Fee</span>
            </div>
            <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.entryFee}</span>
          </div>

          {/* Policy Item 2: Open for tourists */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
             <div className="flex items-center gap-2 min-w-[200px]">
                 {/* Using Info icon as placeholder for microscope/search variant */}
                <Info size={24} color="#000000" /> 
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Open for tourists</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.timings}</span>
          </div>

          {/* Policy Item 3: Photography */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
             <div className="flex items-center gap-2 min-w-[200px]">
                <Camera size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Photography</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.photography}</span>
          </div>

           {/* Policy Item 4: No age restriction */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
             <div className="flex items-center gap-2 min-w-[200px]">
                <User size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Age Limit</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.ageLimit}</span>
          </div>

          {/* Policy Item 5: Quiet hours */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
             <div className="flex items-center gap-2 min-w-[200px]">
                <Moon size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Quiet hours</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.quietHours}</span>
          </div>

          {/* Policy Item 6: Smoking */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2 border-b border-[#DDDFE3]">
             <div className="flex items-center gap-2 min-w-[200px]">
                <CigaretteOff size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Smoking</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.smoking}</span>
          </div>

          {/* Policy Item 7: Pets */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-2">
             <div className="flex items-center gap-2 min-w-[200px]">
                <PawPrint size={24} color="#000000" />
                <span className="font-inter font-semibold text-[24px] leading-[1.33] text-[#1F2226]">Pets</span>
            </div>
             <span className="font-roboto font-normal text-[16px] leading-[1.5] text-[#383E48] text-right md:text-left">{guidelines.pets}</span>
          </div>
        </div>

        {/* Bottom Info Cards Frame 2147239373 */}
        {guidelines.notes && guidelines.notes.length > 0 && (
            <div className="flex flex-col md:flex-row gap-6 md:gap-[44px] w-full">
                {guidelines.notes.map((note, index) => (
                    <div key={index} className="flex-1 bg-[#FFE9BE66] border border-[#13201957] rounded-[10px] p-5 flex items-center justify-center">
                        <p className="font-montserrat font-semibold text-[20px] leading-[1.2] text-[#132019] text-center">
                            {note}
                        </p>
                    </div>
                ))}
            </div>
        )}

      </div>
    </section>
  );
}
