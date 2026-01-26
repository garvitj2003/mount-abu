"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";

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
        transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
};

export default function AppDownloadSection() {
    const cardBgColorHex = "#f5f2e9";
    const cardBgColorRgb = "245, 242, 233";

    return (
        <section id="app-download" className="relative w-full overflow-hidden bg-[#132019]">
            {/* Background Gradients */}
            <div
                className="absolute top-0 left-0 w-full h-48 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-40 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div className="absolute w-full h-full inset-0 bg-none bg-[#132019]">
                <Image
                    src="/images/sections/download.png"
                    fill
                    alt="background pattern"
                    className="object-cover opacity-30"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 md:px-20.5 py-16 md:py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="bg-[#f5f2e9] rounded-3xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl"
                >
                    {/* --- LEFT COLUMN (Text) --- */}
                    <motion.div
                        variants={slideFromLeft}
                        className="w-full h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center gap-8 z-20"
                    >
                        <div className="flex flex-col gap-4 w-full text-center">
                            <h2 className="font-baron font-black text-2xl md:text-3xl lg:text-4xl text-[#121e17] capitalize leading-normal">
                                Get Our Application
                            </h2>
                            <h3 className="font-montserrat font-normal text-center text-sm md:text-base text-[#17261e] leading-relaxed max-w-lg mx-auto">
                                Complete digital companion: Instant token
                                approvals with QR tracking, real-time complaint
                                filing & status updates with photo evidence,
                                essential certificates access, live municipal
                                alerts, ward maps, & 24/7 service dashboard—all
                                from your phone
                            </h3>
                        </div>

                        {/* App Store Buttons */}
                        <div className="flex gap-4 md:gap-6 items-center flex-wrap justify-center">
                            <a
                                href="#"
                                className="w-24 h-24 md:w-28 md:h-28 bg-white border border-[#d4d4d4] rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow overflow-hidden p-3 md:p-4"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/images/google-play-logo.svg"
                                        alt="Get it on Google Play"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </a>

                            <a
                                href="#"
                                className="w-24 h-24 md:w-28 md:h-28 bg-white border border-[#d4d4d4] rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow overflow-hidden p-3 md:p-4"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/images/apple-logo.png"
                                        alt="Download on App Store"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </a>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN (Image Container) --- */}
                    <motion.div
                        variants={slideFromRight}
                        className="relative w-full h-full min-h-[300px] md:min-h-[420px]"
                    >
                        <Image
                            src="/images/Mockups.png"
                            alt="Mount Abu App"
                            fill
                            className="object-cover object-center"
                            priority
                        />

                        {/* --- Gradient Overlay: Left (Fade from Text) --- */}
                        <div
                            className="absolute top-0 left-0 h-full w-1/5 z-10 pointer-events-none hidden lg:block"
                            style={{
                                background: `linear-gradient(to right, ${cardBgColorHex} 0%, rgba(${cardBgColorRgb}, 0) 100%)`,
                            }}
                        />
                        
                        {/* Mobile Gradient (Top down) */}
                        <div
                            className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none lg:hidden"
                            style={{
                                background: `linear-gradient(to bottom, ${cardBgColorHex} 0%, rgba(${cardBgColorRgb}, 0) 100%)`,
                            }}
                        />

                        {/* --- Gradient Overlay: Right (Fade to Edge) --- */}
                        <div
                            className="absolute top-0 right-0 h-full w-1/5 z-10 pointer-events-none hidden lg:block"
                            style={{
                                background: `linear-gradient(to left, ${cardBgColorHex} 0%, rgba(${cardBgColorRgb}, 0) 100%)`,
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}