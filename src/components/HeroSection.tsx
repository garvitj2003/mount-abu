"use client";

import Image from "next/image";
import HeroCarousel from "./heroCaraousel";
import { motion } from "motion/react";
import NavigationHeader from "./NavigationHeader";

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
        <div className="flex items-center shrink-0 w-44 md:w-40">
            <div
                className="flex flex-col gap-3 md:gap-4 items-center justify-center p-3 md:p-4 rounded-xl border border-[#d4af37] border-solid grow"
                style={{
                    background: "rgba(19, 32, 25, 0.2)",
                    backdropFilter: "blur(2.259px)",
                    WebkitBackdropFilter: "blur(2.259px)",
                }}
            >
                {/* Profile Image */}
                <div className="flex items-center justify-center">
                    <div className="relative w-28 h-28 md:w-20 md:h-20 rounded-full overflow-hidden">
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
                    <div className="flex flex-col gap-1 md:gap-2 items-center justify-center text-[#f5f2e9] text-center grow">
                        <div className="font-montserrat font-bold text-lg md:text-sm leading-normal capitalize w-full">
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
                        <div className="font-montserrat font-medium text-sm md:text-[10px] leading-tight">
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

export default function HeroSection() {
    return (
        <>
            <div className="relative w-full h-[80vh] md:h-screen md:min-h-[800px] overflow-hidden flex flex-col">
                {/* Navigation Header */}
                <NavigationHeader />

                {/* Hero Content Area */}
                <div className="relative flex-grow overflow-hidden">
                    {/* Full-page Background Image - Hero */}
                    <HeroCarousel />

                    {/* Bottom Gradient Overlay - Dark green fade */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-72"
                        style={{
                            background:
                                "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0.8) 40%, rgba(19, 32, 25, 0.4) 70%, transparent 100%)",
                        }}
                    />

                    {/* Second gradient layer for deeper bottom */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-48"
                        style={{
                            background:
                                "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0.6) 60%, transparent 100%)",
                        }}
                    />

                    {/* Explore Text - Centered at bottom */}
                    <div className="absolute bottom-10 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <p className="font-baron text-xl text-[#d4af37] leading-normal tracking-[0.2em]">
                            Explore
                        </p>
                    </div>

                    {/* Minister Cards - Bottom centered on mobile, right-aligned on desktop */}
                    <div className="absolute bottom-24 md:bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 flex flex-row gap-2 md:gap-5 items-center scale-[0.85] sm:scale-90 md:scale-100 origin-bottom md:origin-bottom-right">
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
            </div>
        </>
    );
}
