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
            prev === 0 ? newsItems.length - 1 : prev - 1,
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === newsItems.length - 1 ? 0 : prev + 1,
        );
    };

    const currentItem = newsItems[currentIndex];

    return (
        <section className="relative w-full min-h-screen py-20">
            {/**overlay fade */}
            <div
                className="absolute top-0 left-0 w-full h-[150px] z-100"
                style={{
                    background:
                        "linear-gradient(to bottom, #7F6D54 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-[200px] z-100"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

            {/* Background pattern with low opacity */}
            <div className="absolute inset-0 ">
                <Image
                    src="/images/sections/newsUpdates.png"
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
                        <h1 className="font-baron text-3xl font-extrabold  text-[#D4AF37] tracking-[0.2em] leading-normal uppercase font-poppins">
                            Updates
                        </h1>
                        <h2 className="font-montserrat font-semibold text-[40px] text-white leading-[48px]">
                            News & Updates
                        </h2>
                    </div>
                    <button className="bg-[#8b7e3a] hover:bg-[#a69545] underline transition-colors text-white font-montserrat font-medium text-[16px] px-[24px] py-[12px] rounded-[8px]">
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

                            <div className="relative z-10 flex items-center justify-between gap-[24px]">
                                {/* Navigation Arrows */}
                                <div className="flex gap-[12px]">
                                    <button
                                        className="w-[44px] h-[44px] rounded-full opacity-40 hover:opacity-60 transition-opacity"
                                        aria-label="Previous slide"
                                        onClick={handlePrev}
                                    >
                                        <Image
                                            src="/images/nav-next.svg"
                                            alt="Previous"
                                            width={44}
                                            height={44}
                                            className="rotate-180"
                                        />
                                    </button>

                                    <button
                                        className="w-[44px] h-[44px] rounded-full hover:opacity-80 transition-opacity"
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

                                {/* Download PDF Button */}
                                {currentItem.pdfLink && (
                                    <a
                                        href={currentItem.pdfLink}
                                        className="bg-[#e85a4f] hover:bg-[#d14a40] transition-colors text-white font-montserrat font-medium text-[16px] px-[32px] py-2 rounded-[8px]"
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
        </section>
    );
}
