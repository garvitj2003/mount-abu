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
        <section className="relative w-full overflow-hidden bg-[#132019]">
            {/* Background Gradients */}
            <div
                className="absolute top-0 left-0 w-full h-[200px] z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-[150px] z-10 pointer-events-none"
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
            <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] py-[80px]">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    // CHANGED: Using Grid for strict 50-50 split
                    // grid-cols-1 for mobile, grid-cols-2 for desktop
                    className={`bg-[${cardBgColorHex}] rounded-[24px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden`}
                >
                    {/* --- LEFT COLUMN (Text) --- */}
                    <motion.div
                        variants={slideFromLeft}
                        // 'h-full' ensures this column takes full height of the grid row
                        className="w-full h-full p-[40px] flex flex-col justify-center items-center gap-[28px] z-20"
                    >
                        <div className="flex flex-col gap-[12px] w-full text-center">
                            <h2 className="font-baron font-black text-[32px] text-[#121e17] capitalize leading-normal">
                                Get Our Application
                            </h2>
                            <h3 className="font-montserrat font-normal text-center text-[14px] text-[#17261e] leading-normal">
                                Complete digital companion: Instant token
                                approvals with QR tracking, real-time complaint
                                filing & status updates with photo evidence,
                                essential certificates access, live municipal
                                alerts, ward maps, & 24/7 service dashboard—all
                                from your phone
                            </h3>
                        </div>

                        {/* App Store Buttons */}
                        <div className="flex gap-[28px] items-start flex-wrap justify-center">
                            <a
                                href="#"
                                className="w-[140px] h-[140px] bg-white border border-[#d4d4d4] rounded-[12px] flex items-center justify-center hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="relative w-[82px] h-[90px]">
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
                                className="w-[140px] h-[140px] bg-white border border-[#d4d4d4] rounded-[12px] flex items-center justify-center hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="relative w-[81px] h-[91px]">
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
                        // relative: creates context for fill image
                        // h-full: ensures it stretches to match the text column height
                        // min-h: ensures visibility on mobile where stacks vertical
                        className="relative w-full h-full min-h-[420px]"
                    >
                        <Image
                            src="/images/Mockups.png"
                            alt="Mount Abu App"
                            fill
                            // object-cover: Ensures image fills the width/height of the grid cell
                            // It will crop top/bottom if needed to maintain aspect ratio
                            className="object-cover"
                            priority
                        />

                        {/* --- Gradient Overlay: Left (Fade from Text) --- */}
                        <div
                            className="absolute top-0 left-0 h-full w-[20%] z-10 pointer-events-none"
                            style={{
                                background: `linear-gradient(to right, ${cardBgColorHex} 0%, rgba(${cardBgColorRgb}, 0) 100%)`,
                            }}
                        />

                        {/* --- Gradient Overlay: Right (Fade to Edge) --- */}
                        <div
                            className="absolute top-0 right-0 h-full w-[20%] z-10 pointer-events-none"
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