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
    return (
        <section className="relative w-full overflow-hidden bg-[#132019]">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[200px] z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute bottom-0 left-0 w-full h-[150px] z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
              <div className="absolute w-full h-full inset-0 bg-none bg-[#132019]">
                  <Image
                      src="/images/sections/download.png"
                      fill
                      alt="testimonals"
                      className="object-cover opacity-30"
                  />
              </div>

            {/* Content container */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] py-[80px]">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="bg-[#f5f2e9] rounded-[24px] flex items-center justify-center gap-[118px] p-[40px] relative overflow-hidden"
                >
                    {/* Left Content */}
                    <motion.div
                        variants={slideFromLeft}
                        className="flex flex-col gap-[28px] items-start justify-center w-[436px] shrink-0"
                    >
                        {/* Text Content */}
                        <div className="flex flex-col gap-[12px] w-full">
                            <h2 className="font-baron font-black text-[32px] text-[#121e17] capitalize leading-normal">
                                Get Our Application
                            </h2>
                            <p className="font-montserrat font-normal text-[14px] text-[#17261e] leading-normal">
                                Complete digital companion: Instant token approvals with QR
                                tracking, real-time complaint filing & status updates with
                                photo evidence, essential certificates access, live municipal
                                alerts, ward maps, & 24/7 service dashboard—all from your
                                phone
                            </p>
                        </div>

                        {/* App Store Buttons */}
                        <div className="flex gap-[28px] items-start">
                            {/* Google Play Button */}
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

                            {/* Apple App Store Button */}
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

                    {/* Right Phone Mockup */}
                    <motion.div
                        variants={slideFromRight}
                        className="relative w-[451px] h-[385px] shrink-0"
                    >
                        {/* Phone with hand */}
                        <div className="relative w-[728px] h-[385px]">
                            <Image
                                src="/images/app-phone-mockup.png"
                                alt="Mount Abu App"
                                fill
                                className="object-contain object-left"
                            />
                        </div>

                        {/* Phone screen content overlay */}
                        <div className="absolute left-[183px] top-[44px] w-[122px] h-[261px] rounded-[16px] overflow-hidden bg-white">
                            <Image
                                src="/images/app-screenshot.png"
                                alt="App Screenshot"
                                fill
                                className="object-cover"
                            />
                            {/* Logo badge */}
                            <div className="absolute left-[18px] top-[74px] w-[85px] h-[97px]">
                                <Image
                                    src="/images/app-logo-badge.png"
                                    alt="Mount Abu Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right gradient fade */}
                    <div className="absolute right-0 top-0 h-full w-[160px] bg-gradient-to-l from-[#f5f2e9] to-transparent pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}
