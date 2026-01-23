"use client";

import Image from "next/image";
import { motion, Variants, AnimatePresence } from "motion/react";
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
    exit: {
        opacity: 0,
        x: -50,
        transition: { duration: 0.5, ease: "easeIn" },
    },
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: { duration: 0.5, ease: "easeIn" },
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
        tag: "Fairs and Festivals this month",
        title: "Vasant Panchami Celebration",
        dateRange: "23 Jan 2026",
        image: "/images/news/vasant-panchami.jpeg",
        pdfLink: "",
    },
    {
        id: 2,
        tag: "Fairs and Festivals this month",
        title: "Republic Day Parade & Events",
        dateRange: "26 Jan 2026",
        image: "/images/news/republic-day.jpeg",
        pdfLink: "",
    },
    {
        id: 3,
        tag: "Upcoming Major Festival",
        title: "Maha Shivratri Devotion",
        dateRange: "15 Feb 2026",
        image: "/images/news/maha-shivratri.jpeg",
        pdfLink: "",
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
        <section id="notices" className="relative w-full min-h-screen py-16 md:py-20 overflow-hidden">
            {/**overlay fade */}
            <div
                className="absolute top-0 left-0 w-full h-40 z-10"
                style={{
                    background:
                        "linear-gradient(to bottom, #7F6D54 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-52 z-10"
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
            <div className="relative z-20 container mx-auto px-4 md:px-8">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 md:mb-12"
                >
                    <div className="flex flex-col gap-3">
                        <h1 className="font-baron text-xl md:text-2xl font-extrabold text-[#D4AF37] tracking-[0.2em] leading-normal uppercase">
                            Updates
                        </h1>
                        <h2 className="font-montserrat font-semibold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                            News & Updates
                        </h2>
                    </div>
                </motion.div>

                {/* News Card */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="relative"
                >
                    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl min-h-[550px] md:min-h-[400px]">
                        {/* Left Content */}
                        <div className="relative bg-[#faf8f3] w-full md:w-[45%] p-6 md:p-10 flex flex-col justify-between order-2 md:order-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`text-${currentItem.id}`}
                                    variants={slideFromLeft}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="relative z-10"
                                >
                                    <p className="font-montserrat text-xs md:text-sm text-[#666] mb-4">
                                        {currentItem.tag}
                                    </p>
                                    <h3 className="font-montserrat font-semibold text-xl md:text-2xl lg:text-3xl text-[#3d6b4f] leading-tight mb-3">
                                        {currentItem.title}
                                    </h3>
                                    <p className="font-montserrat text-sm md:text-base text-[#888] mb-8">
                                        {currentItem.dateRange}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                {/* Navigation Arrows */}
                                <div className="flex gap-3">
                                    <button
                                        className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
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
                                        className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:opacity-80 transition-opacity"
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
                                        className="w-full sm:w-auto bg-[#e85a4f] hover:bg-[#d14a40] transition-colors text-white font-montserrat font-medium text-sm md:text-base px-8 py-3 rounded-lg text-center"
                                    >
                                        Download PDF
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right Image */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`image-${currentItem.id}`}
                                variants={slideFromRight}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative w-full md:w-[55%] h-[250px] md:h-auto min-h-[250px] md:min-h-full order-1 md:order-2"
                            >
                                <Image
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
