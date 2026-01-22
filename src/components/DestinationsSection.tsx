"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { topDestinations, functionalCategories } from "../data/data";

// Define the shape of our destination data based on data.js
interface Destination {
    id: string;
    slug: string;
    title: string;
    description: string;
    details: {
        images: {
            main: string;
            gallery: string[];
        };
        heading: string;
        text: string;
    };
    // ... other fields if needed
}

type FunctionalCategories = typeof functionalCategories;
type CategoryKey = keyof FunctionalCategories;

export default function DestinationsSection() {
    const router = useRouter();
    // Categories: "Top" + keys from functionalCategories
    const categories = ["Top", ...Object.keys(functionalCategories).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))];

    const [activeCategory, setActiveCategory] = useState("Top");
    const [currentDestinations, setCurrentDestinations] = useState<Destination[]>(topDestinations);
    const [activeIndex, setActiveIndex] = useState(Math.floor(topDestinations.length / 2));
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle Category Click
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        let newData: Destination[] = [];

        if (category === "Top") {
            newData = topDestinations;
        } else {
            const key = category.toLowerCase() as CategoryKey;
            // Check if the key exists in functionalCategories to be safe, though our categories array is derived from it.
            if (key in functionalCategories) {
                newData = functionalCategories[key];
            } else {
                newData = [];
            }
        }

        setCurrentDestinations(newData);
        // Reset to center of new list
        setActiveIndex(Math.floor(newData.length / 2));
    };

    const handleNext = () => {
        if (currentDestinations.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % currentDestinations.length);
    };

    const handlePrev = () => {
        if (currentDestinations.length === 0) return;
        setActiveIndex(
            (prev) => (prev - 1 + currentDestinations.length) % currentDestinations.length,
        );
    };

    const getPosition = (index: number) => {
        const total = currentDestinations.length;
        if (total === 0) return 0;
        let offset = (index - activeIndex + total) % total;

        // Logic to center the offset around 0 for any array length
        if (offset > total / 2) {
            offset -= total;
        }

        return offset;
    };

    return (
        <section id="destinations" className="relative w-full min-h-screen py-16 md:py-24 bg-[#132019] overflow-hidden flex flex-col items-center">
            {/* --- Background --- */}
            <div className="absolute inset-0 opacity-40">
                <Image
                    src="/images/destination-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>
            <div
                className="absolute top-0 left-0 w-full h-[30rem]"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0.6) 60%, transparent 100)",
                }}
            />
            <div
                className="absolute top-0 left-0 w-full h-72"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0.8) 40%, rgba(19, 32, 25, 0.4) 70%, transparent 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-52"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

            {/* --- Header Content --- */}
            <div className="relative z-10 flex flex-col items-center mb-6 md:mb-10 px-4">
                <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal tracking-wide mb-4">
                    Destinations
                </p>
                <h2 className="text-[#f5f2e9] text-center capitalize mb-8">
                    <span className="font-montserrat font-medium text-3xl md:text-4xl block md:inline md:mr-3 drop-shadow-lg">
                        Top Destinations to visit
                    </span>
                    <span className="font-montserrat font-semibold text-4xl md:text-5xl drop-shadow-lg">
                        Mount Abu
                    </span>
                </h2>

                {/* --- Category Badges/Tabs --- */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`
                                px-4 py-2 rounded-xl text-sm md:text-base font-montserrat font-medium transition-all duration-300 border border-[#D4AF37]
                                ${activeCategory === cat
                                    ? "bg-gradient-to-br from-[#D4AF37] to-[#17241B] text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                                    : "bg-[#D4AF37]/[0.08] text-[#D4AF37] hover:bg-[#D4AF37]/20"}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- 3D Carousel Container --- */}
            <div
                className="relative w-full max-w-6xl h-[350px] md:h-[450px] flex items-center justify-center mt-8 md:mt-0"
                style={{ perspective: "1000px" }}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {currentDestinations.length > 0 ? (
                        currentDestinations.map((dest, index) => {
                            const position = getPosition(index);
                            const isCenter = position === 0;

                            // Check if the card is within the visible 5-card range
                            const isVisible = Math.abs(position) <= 2;

                            let xOffset = 0;
                            let zIndex = 0;
                            let scale = 1;
                            let rotateY = 0;
                            let opacity = 1;
                            let brightness = 1;

                            // Responsive xOffset logic
                            const baseOffset = isMobile ? 120 : 260;
                            const farOffset = isMobile ? 180 : 220;

                            if (position === 0) {
                                // Center
                                zIndex = 50;
                                scale = 1.15;
                                opacity = 1;
                            } else if (position === -1 || position === 1) {
                                // Immediate Neighbors
                                xOffset = position * baseOffset;
                                zIndex = 30;
                                scale = 0.9;
                                rotateY = position === -1 ? 15 : -15;
                                opacity = isMobile ? 0.7 : 1;
                                brightness = 0.8;
                            } else if (position === -2 || position === 2) {
                                // Far Neighbors
                                xOffset = position * farOffset;
                                zIndex = 10;
                                scale = 0.85;
                                rotateY = position === -2 ? 25 : -25;
                                opacity = isMobile ? 0 : 0.9; // Hide far neighbors on mobile
                                brightness = 0.6;
                            } else {
                                // HIDDEN
                                xOffset = 0;
                                zIndex = -10;
                                scale = 0;
                                opacity = 0;
                            }

                            // Use image from data, fallback to a placeholder if missing
                            const imageSrc = dest.details?.images?.main || "/images/placeholder.jpg";

                            return (
                                <motion.div
                                    key={dest.id}
                                    onClick={() => router.push(`/destinations/${dest.slug}`)}
                                    initial={false}
                                    animate={{
                                        x: xOffset,
                                        scale: scale,
                                        zIndex: zIndex,
                                        rotateY: rotateY,
                                        opacity: opacity,
                                        filter: `brightness(${brightness})`,
                                    }}
                                    transition={{
                                        duration: 0.9,
                                        ease: [0.25, 1, 0.5, 0.9],
                                    }}
                                    className="absolute w-64 h-80 md:w-[331px] md:h-[408px] rounded-xl cursor-pointer"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        pointerEvents: isVisible && opacity > 0 ? "auto" : "none",
                                    }}
                                >
                                    {/* Image Card Container */}
                                    <div
                                        className={`relative w-full h-full rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group ${
                                            isCenter
                                                ? "border-4 border-[#122018] hover:scale-102"
                                                : ""
                                        }`}
                                    >
                                        <Image
                                            src={imageSrc}
                                            alt={dest.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 331px"
                                        />

                                        {/* Overlay for depth on non-center cards */}
                                        {!isCenter && (
                                            <div className="absolute inset-0 bg-black/30 z-10" />
                                        )}

                                        {/* --- HOVER EFFECT (Only for center card) --- */}
                                        {isCenter && (
                                            <div className="absolute inset-4 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out rotate-12 pointer-events-none z-20" />
                                        )}
                                    </div>

                                    {/* Content - Only Visible for Center Card */}
                                    <AnimatePresence>
                                        {isCenter && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    transition: { duration: 0.2 },
                                                }}
                                                transition={{
                                                    delay: 0.2,
                                                    duration: 0.4,
                                                }}
                                                className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-center z-50"
                                            >
                                                <div className="absolute bottom-0 left-0 w-full h-48 md:h-[250px] bg-gradient-to-t from-black via-black/70 to-transparent -z-10 rounded-b-xl" />

                                                <h3 className="font-montserrat font-bold text-xl md:text-2xl text-[#f5f2e9] mb-1 md:mb-2 drop-shadow-md">
                                                    {dest.title}
                                                </h3>
                                                <p className="font-montserrat text-xs md:text-sm text-gray-200 leading-relaxed drop-shadow-sm line-clamp-2 md:line-clamp-none">
                                                    {dest.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    ) : (
                         <div className="text-white/50 font-montserrat">No destinations found in this category.</div>
                    )}
                </div>
            </div>

            {/* --- Navigation Controls --- */}
            {currentDestinations.length > 0 && (
                <div className="flex items-center gap-5 relative z-20 mt-8 md:mt-12">
                    <button
                        className="w-11 h-11 rounded-full opacity-40 hover:opacity-60 transition-opacity"
                        aria-label="Previous slide"
                        onClick={handlePrev}
                    >
                        <Image
                            src="/images/nav-prev.svg"
                            alt="Previous"
                            width={44}
                            height={44}
                            className="rotate-180"
                        />
                    </button>

                    <button
                        className="w-11 h-11 rounded-full hover:opacity-80 transition-opacity"
                        aria-label="Next slide"
                        onClick={handleNext}
                    >
                        <Image
                            src="/images/nav-next.svg"
                            alt="Next"
                            width={44}
                            height={44}
                        />
                    </button>
                </div>
            )}
        </section>
    );
}
