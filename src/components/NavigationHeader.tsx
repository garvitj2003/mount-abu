"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface NavigationHeaderProps {
  variant?: "dark" | "light";
}

const RunningBorderButton = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
    return (
        <div className="flex w-full items-center justify-center">
            <button className={`relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-montserrat font-medium transition-colors ${variant === "dark" ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}>
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        padding: "2px",
                        maskImage:
                            "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
                        maskClip: "content-box, border-box",
                        maskComposite: "exclude",
                        WebkitMaskComposite: "xor",
                    }}
                >
                    <motion.div
                        className="absolute inset-[-100%]"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 4,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        style={{
                            background: variant === "dark" 
                                ? `conic-gradient(from 0deg, transparent 0%, transparent 70%, #09090b 100%)`
                                : `conic-gradient(from 0deg, transparent 0%, transparent 70%, #5B5036 100%)`,
                        }}
                    />
                </motion.div>
                <span className="relative z-10">हिन्दी</span>
                <div className={`absolute inset-0 rounded-full border ${variant === "dark" ? "border-white/20" : "border-black/10"}`} />
            </button>
        </div>
    );
};

export default function NavigationHeader({ variant = "dark" }: NavigationHeaderProps) {
    const isDark = variant === "dark";

    return (
        <header className={`relative md:absolute md:top-0 md:left-0 md:right-0 w-full z-50 backdrop-blur-md h-20 flex items-center justify-between px-4 md:px-8 border-b ${isDark ? "border-white/80 bg-[#132019] md:bg-transparent text-white" : "border-black/10 bg-white/80 md:bg-transparent text-black"}`}>
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
                <span className={`font-montserrat font-semibold text-base md:text-lg ${isDark ? "text-white" : "text-[#132019]"}`}>
                    Nagar Palika Mount Abu
                </span>
            </div>

            {/* Right side - Language and Menu */}
            <div className="flex items-center gap-4 md:gap-6">
                <RunningBorderButton variant={variant} />
                <button className={`p-2 rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}>
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
