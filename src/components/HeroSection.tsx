"use client";

import Image from "next/image";
import OverlappingFrames from "./overLappingFrames";
import HeroCarousel from "./heroCaraousel";
import { motion } from "motion/react";

const RunningBorderButton = () => {
    return (
      <div className="flex  w-full items-center justify-center">
            
            <button className="relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-montserrat font-medium text-white transition-colors hover:bg-white/10">
              
              {/* 1. THE ANIMATED BORDER LAYER 
                - We place this absolutely so it sits behind the text.
                - We use 'inset-0' to fill the button.
                - We use a CSS Mask to cut out the center, leaving only a border.
              */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  // The padding creates the border thickness (2px here)
                  padding: "2px", 
                  
                  // This mask magic cuts out the center content-box from the border-box
                  maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
                  maskClip: "content-box, border-box",
                  maskComposite: "exclude", 
                  WebkitMaskComposite: "xor", // Needed for Chrome/Safari
                }}
              >
                {/* The Spinning Gradient 
                   - It needs to be much larger than the button to cover corners when spinning.
                   - We center it and spin it.
                */}
                <motion.div
                  className="absolute inset-[-100%]"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  style={{
                    // This creates the "Tail" effect. 
                    // Using your requested color #09090b (which is very dark).
                    // Note: On a dark blue bg, #09090b might look like a shadow. 
                    background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, #09090b 100%)`,
                    
                    // If you want the white/bright look from your image reference, use this instead:
                    // background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, #ffffff 100%)`,
                  }}
                />
              </motion.div>
      
              {/* 2. THE CONTENT LAYER 
                - Relative positioning keeps it clickable and above the background (though bg is transparent).
              */}
              <span className="relative z-10">हिन्दी</span>
              
              {/* Optional: Static Border overlay if you want a faint outline always visible 
                  (Remove this if you want ONLY the moving light) */}
              <div className="absolute inset-0 rounded-full border border-white/20" />
            </button>
          </div>
    );
};
// Minister Card Component (Unchanged)
function MinisterCard({
    imageSrc,
    name,
    title,
}: {
    imageSrc: string;
    name: string | string[];
    title: string | string[];
}) {
    const nameArray = Array.isArray(name) ? name : [name];
    const titleArray = Array.isArray(title) ? title : [title];

    return (
        <div className="flex items-center shrink-0 w-44">
            <div
                className="flex flex-col gap-4 items-center justify-center p-4 rounded-xl border border-[#d4af37] border-solid grow"
                style={{
                    background: "rgba(19, 32, 25, 0.2)",
                    backdropFilter: "blur(2.259px)",
                    WebkitBackdropFilter: "blur(2.259px)",
                }}
            >
                {/* Profile Image */}
                <div className="flex items-center justify-center">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{ background: "rgba(245, 242, 233, 0.11)" }}
                        />
                        <div
                            className="absolute inset-0 overflow-hidden rounded-full"
                            style={{
                                backdropFilter: "blur(0.46px)",
                                WebkitBackdropFilter: "blur(0.46px)",
                            }}
                        >
                            <Image
                                src={imageSrc}
                                alt={nameArray.join(" ")}
                                fill
                                className="object-cover"
                                style={{ objectPosition: "center top" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Name and Title */}
                <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col gap-2 items-center justify-center text-[#f5f2e9] text-center grow">
                        <div className="font-montserrat font-bold text-lg leading-normal capitalize w-full">
                            {nameArray.map((line, i) => (
                                <p
                                    key={i}
                                    className={
                                        i < nameArray.length - 1 ? "mb-0" : ""
                                    }
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                        <div className="font-montserrat font-medium text-sm leading-tight">
                            {titleArray.map((line, i) => (
                                <p
                                    key={i}
                                    className={
                                        i < titleArray.length - 1 ? "mb-0" : ""
                                    }
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Navigation Header Component (Unchanged)
function NavigationHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/80">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {/* Logo placeholder - mountain icon */}
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        className="text-[#1197ff]"
                    >
                        <circle cx="16" cy="16" r="14" fill="#4CAF50" />
                        <path
                            d="M8 22L12 14L16 18L22 10L26 22H8Z"
                            fill="#2E7D32"
                        />
                        <circle cx="22" cy="10" r="3" fill="#FDD835" />
                    </svg>
                </div>
                <span className="text-white font-montserrat font-semibold text-base md:text-lg">
                    Nagar Palika Mount Abu
                </span>
            </div>

            {/* Right side - Language and Menu */}
            <div className="flex items-center gap-4 md:gap-6">
                <RunningBorderButton />
                <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>
        </header>
    );
}

export default function HeroSection() {
    return (
        <>
            <div className="relative w-full h-screen min-h-[800px] overflow-hidden">
                {/* CLOUD LAYER:
                  z-[100] ensures it is on top of everything (Nav, Text, Images).
                  pointer-events-none ensures clicks pass through to the page
                  after clouds fly away.
                */}
                <div className="absolute inset-0 z-[100] pointer-events-none">
                    <OverlappingFrames />
                </div>

                {/* Navigation Header */}
                <NavigationHeader />

                {/* Full-page Background Image - Hero */}
                <HeroCarousel />

                {/* Bottom Gradient Overlay - Dark green fade */}
                <div
                    className="absolute bottom-0 left-0 w-full h-72"
                    style={{
                        background:
                            "linear-gradient(to top, #000 0%, rgba(19, 32, 25, 0.8) 40%, rgba(19, 32, 25, 0.4) 70%, transparent 100%)",
                    }}
                />

                {/* Second gradient layer for deeper bottom */}
                <div
                    className="absolute bottom-0 left-0 w-full h-48"
                    style={{
                        background:
                            "linear-gradient(to top, #000 0%, rgba(19, 32, 25, 0.6) 60%, transparent 100%)",
                    }}
                />

                {/* Explore Text - Centered at bottom */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <p className="font-baron text-xl text-[#d4af37] leading-normal tracking-[0.2em] uppercase">
                        EXPLORE
                    </p>
                </div>

                {/* Minister Cards - Bottom centered on mobile, right-aligned on desktop */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 md:bottom-14 flex flex-row gap-2 md:gap-5 items-center scale-[0.65] sm:scale-90 md:scale-100 origin-bottom md:origin-bottom-right">
                    <MinisterCard
                        imageSrc="/images/minister2.png"
                        name={["Shri Bhajan", "Lal Sharma"]}
                        title={["Chief Minister,", "Rajasthan"]}
                    />
                    <MinisterCard
                        imageSrc="/images/minister1.png"
                        name={["Shri Jhabar", "Singh Kharra"]}
                        title={["Hon'ble Minister of", "UDH"]}
                    />
                </div>
            </div>
        </>
    );
}
