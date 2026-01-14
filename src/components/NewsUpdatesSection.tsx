"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";
import { useState } from "react";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

interface NewsItem {
    id: number;
    tag: string;
    title: string;
    dateRange: string;
    image: string;
    pdfLink?: string;
}

const newsItems: NewsItem[] = [
    {
        id: 1,
        tag: "Fairs and Festivals for the next 5 years",
        title: "Experience Mount Abu's Vibrant Festivals",
        dateRange: "2025-26 To 2029-30",
        image: "/images/fairs-festivals.png",
        pdfLink: "#",
    },
];

export default function NewsUpdatesSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? newsItems.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === newsItems.length - 1 ? 0 : prev + 1
        );
    };

    const currentItem = newsItems[currentIndex];

    return (
        <section className="relative w-full">
            {/* Main content area with cream background */}
            <div className="relative bg-[#132019] w-full overflow-hidden py-10">
                {/* Background pattern with low opacity */}
                <div className="absolute inset-0 opacity-[0.14]">
                    <Image
                        src="/images/about-pattern.png"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content container */}
                <div className="relative z-10 max-w-[1440px] mx-auto px-[120px] py-[60px]">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="flex justify-between items-start mb-[40px]"
                    >
                        <div className="flex flex-col gap-[12px]">
                            <p className="font-baron text-[20px] text-[#c45c3e] tracking-[0.2em] leading-normal uppercase">
                                Updates
                            </p>
                            <h2 className="font-montserrat font-semibold text-[40px] text-white leading-[48px]">
                                News & Updates
                            </h2>
                        </div>
                        <button className="bg-[#8b7e3a] hover:bg-[#a69545] transition-colors text-white font-montserrat font-medium text-[16px] px-[24px] py-[12px] rounded-[8px]">
                            View More
                        </button>
                    </motion.div>

                    {/* News Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="relative"
                    >
                        <div className="flex rounded-[16px] overflow-hidden shadow-lg">
                            {/* Left Content */}
                            <motion.div
                                variants={slideFromLeft}
                                className="relative bg-[#faf8f3] w-[45%] p-[40px] flex flex-col justify-between min-h-[400px]"
                            >
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-[0.08]">
                                    <Image
                                        src="/images/about-pattern.png"
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <p className="font-montserrat text-[14px] text-[#666] mb-[16px]">
                                        {currentItem.tag}
                                    </p>
                                    <h3 className="font-montserrat font-semibold text-[28px] text-[#3d6b4f] leading-[36px] mb-[12px]">
                                        {currentItem.title}
                                    </h3>
                                    <p className="font-montserrat text-[16px] text-[#888] mb-[32px]">
                                        {currentItem.dateRange}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center gap-[24px]">
                                    {/* Navigation Arrows */}
                                    <div className="flex gap-[12px]">
                                        <button
                                            onClick={handlePrev}
                                            className="w-[44px] h-[44px] rounded-full border border-[#ccc] flex items-center justify-center hover:border-[#999] transition-colors"
                                            aria-label="Previous"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-[#666]"
                                            >
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="w-[44px] h-[44px] rounded-full border border-[#333] flex items-center justify-center hover:border-[#000] transition-colors"
                                            aria-label="Next"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-[#333]"
                                            >
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Download PDF Button */}
                                    {currentItem.pdfLink && (
                                        <a
                                            href={currentItem.pdfLink}
                                            className="bg-[#e85a4f] hover:bg-[#d14a40] transition-colors text-white font-montserrat font-medium text-[16px] px-[32px] py-[14px] rounded-[8px]"
                                        >
                                            Download PDF
                                        </a>
                                    )}
                                </div>
                            </motion.div>

                            {/* Right Image */}
                            <motion.div
                                variants={slideFromRight}
                                className="relative w-[55%] min-h-[400px]"
                            >
                                <Image
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
