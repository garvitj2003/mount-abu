"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    animate,
    AnimatePresence,
    Variants,
} from "motion/react";
import { trekGroups } from "../../data/data";

// --- ANIMATION VARIANTS ---
const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.8, delayChildren: 0.5 },
    },
};

const itemRevealVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { ease: "easeInOut" },
    },
};

const textTabChangeVariants: Variants = {
    initial: { opacity: 0, y: 25, filter: "blur(8px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
    exit: {
        opacity: 0,
        y: -15,
        filter: "blur(8px)",
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

const rightColEntryVariants: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 },
    },
};

export default function AdventuresSection() {
    const router = useRouter();
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [activeRouteIndex, setActiveRouteIndex] = useState(0);

    const currentGroup = trekGroups[activeGroupIndex];
    const currentRoute = currentGroup.routes[activeRouteIndex];

    // --- LINE ANIMATION LOGIC ---
    const highlightX = useMotionValue(0);
    const highlightY = useMotionValue(0);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const mobileTabRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset refs array when group changes to avoid stale refs
        tabRefs.current = tabRefs.current.slice(0, currentGroup.routes.length);
        mobileTabRefs.current = mobileTabRefs.current.slice(
            0,
            currentGroup.routes.length,
        );
    }, [currentGroup]);

    useEffect(() => {
        // Desktop Animation
        const activeTab = tabRefs.current[activeRouteIndex];
        if (activeTab && scrollContainerRef.current) {
            const newX = activeTab.offsetLeft + 10;
            animate(highlightX, newX, {
                type: "spring",
                stiffness: 200,
                damping: 30,
            });

            const container = scrollContainerRef.current;
            const scrollLeft =
                activeTab.offsetLeft -
                container.clientWidth / 2 +
                activeTab.clientWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
            });
        }

        // Mobile Animation
        // We add a small delay to allow the layout (accordion expansion) to settle or start
        // Using a timeout is a simple way to wait for the re-render layout shift
        const updateMobileLine = () => {
            const activeMobileTab = mobileTabRefs.current[activeRouteIndex];
            if (activeMobileTab) {
                // The dot is relative to the "relative pl-2" container.
                // activeMobileTab is the wrapper div for each route.
                // We want the line to center on the dot which is at top:0 inside that div relative to the list container.
                const newY = activeMobileTab.offsetTop + 10; // +10 to center on the 20px dot
                animate(highlightY, newY, {
                    type: "spring",
                    stiffness: 200,
                    damping: 30,
                });
            }
        };

        // Call immediately and slightly after to catch layout shifts
        updateMobileLine();
        const timer = setTimeout(updateMobileLine, 400); // Wait for accordion animation (0.4s)
        return () => clearTimeout(timer);
    }, [activeRouteIndex, highlightX, highlightY, currentGroup]);

    const backgroundGradient = useMotionTemplate`
    linear-gradient(
      90deg,
      transparent,
      transparent calc(${highlightX}px - 200px),
      #d4af37 ${highlightX}px,
      rgba(110, 91, 29, 0.1) calc(${highlightX}px + 100px),
      transparent
    )
  `;

    const mobileBackgroundGradient = useMotionTemplate`
    linear-gradient(
      180deg,
      transparent,
      transparent calc(${highlightY}px - 100px),
      #d4af37 ${highlightY}px,
      rgba(110, 91, 29, 0.1) calc(${highlightY}px + 100px),
      transparent
    )
  `;

    // Handlers for Arrows (Cycle Start Points)
    const handlePrevGroup = () => {
        setActiveGroupIndex((prev) =>
            prev === 0 ? trekGroups.length - 1 : prev - 1,
        );
        setActiveRouteIndex(0); // Reset route when changing start point
    };

    const handleNextGroup = () => {
        setActiveGroupIndex((prev) =>
            prev === trekGroups.length - 1 ? 0 : prev + 1,
        );
        setActiveRouteIndex(0); // Reset route when changing start point
    };

    // Image fallback logic
    const mainImage =
        currentRoute?.images?.main || "/images/adventure-main.png";
    // Fallback to main image if small ones are missing, or a default placeholder
    const smallImage1 =
        currentRoute?.images?.gallery?.[0] || "/images/adventure-small-1.png";
    const smallImage2 =
        currentRoute?.images?.gallery?.[1] || "/images/adventure-small-2.png";

    return (
        <section
            id="adventures"
            className="relative w-full min-h-screen bg-[#17261e] overflow-hidden"
        >
            {/* --- Background Assets --- */}
            <div className="absolute inset-0 mix-blend-overlay opacity-[0.54]">
                <Image
                    src="/images/adventures-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>
            <div className="absolute top-0 left-0 w-full h-52 bg-gradient-to-b from-[#132019] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-[#132019] to-transparent" />
            <div className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-[#132019] to-transparent hidden md:block" />
            <div className="absolute top-0 right-0 h-full w-1/5 bg-gradient-to-l from-[#132019] to-transparent hidden md:block" />

            {/* --- Content --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 pb-32 md:pb-40">
                {/* Title */}
                <div className="flex flex-col items-center gap-6 text-center mb-12 md:mb-16">
                    <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal tracking-wider">
                        Adventures
                    </p>
                    <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight">
                        Eco tourism & adventures
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-16">
                    {/* ================= MOBILE LAYOUT (Vertical) ================= */}
                    <div className="flex flex-col md:hidden w-full gap-8">
                        {/* Mobile Group Selector */}
                        <div className="flex justify-between items-center px-2 py-4 border-b border-white/10">
                            <h3 className="font-montserrat font-medium text-xl text-[#f5f2e9] tracking-wide">
                                {currentGroup.startPoint}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    className="p-2 hover:opacity-80 transition-opacity"
                                    onClick={handlePrevGroup}
                                >
                                    <Image
                                        src="/images/nav-next.svg"
                                        alt="Prev"
                                        width={32}
                                        height={32}
                                        className="rotate-180"
                                    />
                                </button>
                                <button
                                    className="p-2 hover:opacity-80 transition-opacity"
                                    onClick={handleNextGroup}
                                >
                                    <Image
                                        src="/images/nav-next.svg"
                                        alt="Next"
                                        width={32}
                                        height={32}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Vertical Accordion */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <motion.div
                                className="absolute left-2.75 top-2 bottom-4 w-[2px]"
                                style={{
                                    background: mobileBackgroundGradient,
                                }}
                            />

                            <div className="flex flex-col gap-10">
                                {currentGroup.routes.map((route, index) => {
                                    const isActive = index === activeRouteIndex;

                                    // Resolve images for this specific route (or fallback)
                                    const rMainImg =
                                        route.images?.main ||
                                        "/images/adventure-main.png";
                                    const rSmall1 =
                                        route.images?.gallery?.[0] ||
                                        "/images/adventure-small-1.png";
                                    const rSmall2 =
                                        route.images?.gallery?.[1] ||
                                        "/images/adventure-small-2.png";

                                    return (
                                        <div
                                            key={route.id}
                                            className="relative pl-10"
                                            ref={(el) => {
                                                mobileTabRefs.current[index] =
                                                    el;
                                            }}
                                        >
                                            {/* Dot Marker */}
                                            <button
                                                onClick={() =>
                                                    setActiveRouteIndex(index)
                                                }
                                                className={`absolute left-[5px] top-0 w-[16px] h-[16px] -ml-[1px] z-10 transition-transform duration-300 ${
                                                    isActive
                                                        ? "scale-125"
                                                        : "scale-100 opacity-70"
                                                }`}
                                            >
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={
                                                            isActive
                                                                ? "/images/trek-dot-active.svg"
                                                                : "/images/trek-dot.svg"
                                                        }
                                                        alt="Dot"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </button>

                                            {/* Content Container */}
                                            <div
                                                onClick={() =>
                                                    setActiveRouteIndex(index)
                                                }
                                                className="cursor-pointer"
                                            >
                                                {!isActive ? (
                                                    // Collapsed State
                                                    <div className="opacity-50 hover:opacity-80 transition-opacity mt-[-2px]">
                                                        <p className="font-montserrat font-medium text-xs text-[#f5f2e9] mb-1 tracking-wider uppercase">
                                                            Route {index + 1}
                                                        </p>
                                                        <p className="font-baron text-lg text-[#d4af37]">
                                                            {route.title}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    // Expanded (Active) State
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                        }}
                                                        className="flex flex-col gap-5 mt-[-4px]"
                                                    >
                                                        {/* Header */}
                                                        <div>
                                                            <p className="font-baron text-2xl text-[#d4af37] leading-tight">
                                                                {
                                                                    currentGroup.startPoint
                                                                }{" "}
                                                                → {route.title}
                                                            </p>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="font-montserrat text-sm text-[#f5f2e9]/80 leading-relaxed text-justify">
                                                            {route.description}
                                                        </p>

                                                        {/* Mobile Image Grid */}
                                                        <div className="grid grid-cols-5 gap-2 h-40 w-full rounded-xl overflow-hidden shadow-lg mt-1">
                                                            {/* Big Image (Left) - Spans 3 cols */}
                                                            <div className="relative col-span-3 h-full">
                                                                <Image
                                                                    src={
                                                                        rMainImg
                                                                    }
                                                                    fill
                                                                    className="object-cover"
                                                                    alt={
                                                                        route.title
                                                                    }
                                                                />
                                                            </div>
                                                            {/* Small Images (Right) - Spans 2 cols */}
                                                            <div className="col-span-2 flex flex-col gap-2 h-full">
                                                                <div className="relative flex-1 rounded-bl-none overflow-hidden">
                                                                    <Image
                                                                        src={
                                                                            rSmall1
                                                                        }
                                                                        fill
                                                                        className="object-cover"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="relative flex-1 rounded-tl-none overflow-hidden">
                                                                    <Image
                                                                        src={
                                                                            rSmall2
                                                                        }
                                                                        fill
                                                                        className="object-cover"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* CTA Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(
                                                                    `/treks/${route.id}`,
                                                                );
                                                            }}
                                                            className="self-start px-6 py-2.5 mt-2 bg-[#d4af37] hover:bg-[#b5952f] text-[#17261e] font-montserrat font-semibold text-xs rounded transition-colors shadow-lg"
                                                        >
                                                            Look For Details
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ================= DESKTOP LAYOUT (Horizontal) ================= */}
                    {/* --- LEFT SIDE (Text & Navigation) --- */}
                    <motion.div
                        className="hidden md:flex flex-col gap-6 w-full md:max-w-2xl order-2 md:order-1"
                        variants={staggerContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {/* DYNAMIC TEXT AREA */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentRoute.id}
                                variants={textTabChangeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col gap-6 min-h-[180px] md:min-h-[220px]"
                            >
                                <div className="flex flex-col gap-4">
                                    <motion.p
                                        variants={itemRevealVariants}
                                        className="font-baron text-2xl md:text-3xl text-[#d4af37]"
                                    >
                                        {currentGroup.startPoint} →{" "}
                                        {currentRoute.title}
                                    </motion.p>
                                </div>
                                <motion.p
                                    variants={itemRevealVariants}
                                    className="font-montserrat font-medium text-base md:text-lg text-[#f5f2e9] leading-relaxed"
                                >
                                    {currentRoute.description}
                                </motion.p>
                                {/* Removed "Official Guides" as it is not present in the new data structure */}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Tabs (Routes) */}
                        <motion.div
                            variants={itemRevealVariants}
                            className="relative mt-12 overflow-x-auto pb-6 md:pb-2 scrollbar-hide"
                            ref={scrollContainerRef}
                            style={{
                                scrollbarWidth: "none" /* Firefox */,
                                msOverflowStyle: "none" /* IE and Edge */,
                            }}
                        >
                            <style jsx global>{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Animated Gold Line */}
                            <motion.div
                                className="absolute top-10 left-0 h-[3px] min-w-full"
                                style={{
                                    background: backgroundGradient,
                                    width: "100%",
                                }}
                            />

                            <div className="flex gap-12 md:gap-24 items-center relative min-w-max">
                                {currentGroup.routes.map((route, index) => (
                                    <button
                                        key={route.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el;
                                        }}
                                        onClick={() =>
                                            setActiveRouteIndex(index)
                                        }
                                        className={`flex flex-col gap-4 items-start p-0 bg-transparent border-none cursor-pointer transition-all duration-300 ${
                                            index !== activeRouteIndex
                                                ? "opacity-40 hover:opacity-70"
                                                : "opacity-100"
                                        }`}
                                    >
                                        <p className="font-montserrat font-medium text-[10px] md:text-xs text-[#f5f2e9] capitalize tracking-wider">
                                            Route {index + 1}
                                        </p>
                                        <div className="w-5 h-5 relative">
                                            <Image
                                                src={
                                                    index === activeRouteIndex
                                                        ? "/images/trek-dot-active.svg"
                                                        : "/images/trek-dot.svg"
                                                }
                                                alt=""
                                                width={20}
                                                height={20}
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        {/* Truncate long titles in tabs if necessary, or just show them */}
                                        <p className="font-baron text-base md:text-lg text-[#d4af37] text-center whitespace-nowrap">
                                            {route.title.length > 20
                                                ? route.title.slice(0, 18) +
                                                  "..."
                                                : route.title}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- RIGHT SIDE (Images) --- */}
                    <motion.div
                        className="hidden md:block relative w-full max-w-[480px] aspect-[4/3] md:h-[373px] order-1 md:order-2"
                        variants={rightColEntryVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="absolute left-0 top-0 w-[60%] md:w-[300px] h-full rounded-xl overflow-hidden shadow-xl">
                            <Image
                                src={mainImage}
                                alt={currentRoute.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="absolute right-0 top-0 w-[35%] md:w-[167px] h-[38%] rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={smallImage1}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute right-0 bottom-0 w-[35%] md:w-[167px] h-[55%] rounded-xl overflow-hidden shadow-lg">
                            <Image
                                src={smallImage2}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- BOTTOM CONTROLS --- */}
            <div className="hidden md:block absolute bottom-12 md:bottom-24 left-0 w-full z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between pointer-events-none">
                    {/* Details Button */}
                    <motion.button
                        onClick={() => router.push(`/treks/${currentRoute.id}`)}
                        className="px-6 py-3 rounded-lg bg-[#d4af37]/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemRevealVariants}
                    >
                        <span className="font-poppins text-sm md:text-base text-white underline">
                            Look For Details
                        </span>
                    </motion.button>

                    {/* Navigation Arrows (Cycle Start Points) */}
                    <div className="flex gap-3 items-center pointer-events-auto">
                        <button
                            className="w-11 h-11 hover:opacity-80 transition-opacity"
                            onClick={handlePrevGroup}
                        >
                            <Image
                                src="/images/nav-next.svg"
                                alt="Previous Start Point"
                                width={44}
                                height={44}
                                className="rotate-180"
                            />
                        </button>
                        <button
                            className="w-11 h-11 hover:opacity-80 transition-opacity"
                            onClick={handleNextGroup}
                        >
                            <Image
                                src="/images/nav-next.svg"
                                alt="Next Start Point"
                                width={44}
                                height={44}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
