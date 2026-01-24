"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NavigationHeaderProps {
    variant?: "dark" | "light";
}

interface MenuItem {
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
    { label: "Home", href: "/" },
    {
        label: "Mount Abu Tourist Information",
        children: [
            { label: "Top Destinations", href: "#destinations" },
            { label: "Eco tourism & adventures", href: "#adventures" },
            { label: "Unexplored Gems of Mount Abu", href: "#hidden-places" },
        ],
    },
    {
        label: "Municipal Services",
        children: [
            { label: "Digital Construction Token", href: "#services" },
            { label: "Complaint Redressal & Tracking", href: "#services" },
            { label: "Vital Certificates (Birth/Death)", href: "#services" },
            { label: "Marriage Certificate", href: "#services" },
        ],
    },
    { label: "City Profile", href: "#city-profile" },
    {
        label: "News & Updates",
        children: [
            { label: "Notices", href: "#notices" },
            { label: "Tenders", href: "#tenders" },
        ],
    },
    {
        label: "Information & Guidelines",
        children: [
            {
                label: "Nagar Palika Act",
                href: "https://drive.google.com/file/d/1k5A-CDzAPz3xCGLcsETX8F3GYdZZxmVP/view?usp=drivesdk",
            },
            {
                label: "Wards Map",
                href: "https://drive.google.com/file/d/1cJExzDqt1iCDeGogL1rOSnEMN-D56tzz/view?usp=drivesdk",
            },
            {
                label: "Construction Guidelines",
                href: "https://drive.google.com/file/d/1PA4DyI-cEGMtTJCSimeTy-QfZ5QR-e57/view?usp=drivesdk",
            },
            { label: "Solid Waste Management", href: "#info-guidelines" },
            {
                label: "Land Purchase Guidelines",
                href: "https://drive.google.com/file/d/1k5A-CDzAPz3xCGLcsETX8F3GYdZZxmVP/view?usp=drivesdk",
            },
            { label: "Restaurant Licences", href: "#info-guidelines" },
            { label: "Taxes", href: "#info-guidelines" },
            { label: "Budget", href: "#info-guidelines" },
        ],
    },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact Diary", href: "#contact" },
    {
        label: "More",
        children: [
            { label: "Get our application", href: "#app-download" },
            { label: "Connect With Us", href: "#connect" },
        ],
    },
];

const RunningBorderButton = ({
    variant = "dark",
}: {
    variant?: "dark" | "light";
}) => {
    return (
        <div className="flex w-full items-center justify-center">
            <button
                className={`relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-montserrat font-medium transition-colors ${variant === "dark" ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}
            >
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
                            background:
                                variant === "dark"
                                    ? `conic-gradient(from 0deg, transparent 0%, transparent 70%, #09090b 100%)`
                                    : `conic-gradient(from 0deg, transparent 0%, transparent 70%, #5B5036 100%)`,
                        }}
                    />
                </motion.div>
                <span className="relative z-10">हिन्दी</span>
                <div
                    className={`absolute inset-0 rounded-full border ${variant === "dark" ? "border-white/20" : "border-black/10"}`}
                />
            </button>
        </div>
    );
};

export default function NavigationHeader({
    variant = "dark",
}: NavigationHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const isDark = variant === "dark";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            setIsOpen(false);
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            setIsOpen(false);
        }
    };

    const toggleExpand = (label: string) => {
        setExpandedItems((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label],
        );
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md transition-all duration-300 h-20 flex items-center justify-between px-4 md:px-8 border-b ${
                    isDark
                        ? `text-white ${isScrolled ? "bg-[#132019]/90 border-white/10 shadow-lg" : "bg-[#132019] md:bg-transparent border-white/10 md:border-transparent"}`
                        : `text-black ${isScrolled ? "bg-white/90 border-black/10 shadow-sm" : "bg-white/80 md:bg-transparent border-black/10 md:border-transparent"}`
                }`}
            >
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        {/* Logo placeholder - mountain icon */}
                        <Image
                            src="/images/footer/logo.png"
                            alt="Nagar Palika Mount Abu"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                    <span
                        className={`font-montserrat font-semibold text-base md:text-lg ${isDark ? "text-white" : "text-[#132019]"}`}
                    >
                        Nagar Palika Mount Abu
                    </span>
                </div>

                {/* Right side - Language and Menu */}
                <div className="flex items-center gap-4 md:gap-6">
                    <RunningBorderButton variant={variant} />
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"}`}
                    >
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

            {/* Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            className="fixed top-0 right-0 h-full w-full max-w-[771px] bg-[#132019]/80 backdrop-blur-[4px] z-[100] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
                        >
                            {/* Background Elements */}
                            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                                {/* Large Background Text */}
                                <div className="absolute top-[40%] right-[-10%] transform -rotate-90 md:rotate-0 md:right-0 md:top-20 opacity-10 whitespace-nowrap">
                                    <span className="font-baron text-[80px] md:text-[140px] leading-none text-white/10 select-none block md:hidden">
                                        EXPLORE
                                        <br />
                                        MOUNT
                                        <br />
                                        ABU
                                    </span>
                                    <span className="font-baron text-[120px] leading-none text-white/10 select-none hidden md:block text-right pr-10">
                                        EXPLORE
                                        <br />
                                        MOUNT
                                        <br />
                                        ABU
                                    </span>
                                </div>

                                {/* Bottom Texture Image */}
                                <div className="absolute bottom-0 right-0 w-full h-[300px] opacity-10">
                                    <Image
                                        src="/images/drawer/bg-texture.png"
                                        alt="Texture"
                                        fill
                                        className="object-cover object-bottom"
                                    />
                                </div>
                            </div>

                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-6 md:p-10 border-b border-white/10 relative z-10">
                                <span className="font-baron font-bold text-2xl md:text-3xl text-white tracking-wider">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                >
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto py-8 px-6 md:px-12 relative z-10 custom-scrollbar">
                                <nav className="flex flex-col gap-8 pb-20">
                                    {menuItems.map((item, index) => (
                                        <div
                                            key={item.label}
                                            className="flex flex-col"
                                        >
                                            <div
                                                className="flex items-center justify-between group cursor-pointer"
                                                onClick={() =>
                                                    item.children
                                                        ? toggleExpand(
                                                              item.label,
                                                          )
                                                        : null
                                                }
                                            >
                                                {item.href && !item.children ? (
                                                    <Link
                                                        href={item.href}
                                                        onClick={(e) =>
                                                            scrollToSection(
                                                                e,
                                                                item.href!,
                                                            )
                                                        }
                                                        className="font-baron text-xl md:text-2xl font-bold text-white hover:text-[#d4af37] transition-colors tracking-widest uppercase"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ) : (
                                                    <span className="font-baron text-xl md:text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors tracking-widest uppercase">
                                                        {item.label}
                                                    </span>
                                                )}

                                                {item.children && (
                                                    <motion.div
                                                        animate={{
                                                            rotate: expandedItems.includes(
                                                                item.label,
                                                            )
                                                                ? 180
                                                                : 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className="p-1"
                                                    >
                                                        <Image
                                                            src="/images/drawer/chevron-down.svg"
                                                            alt="Expand"
                                                            width={24}
                                                            height={24}
                                                            className="text-white group-hover:brightness-75 transition-all"
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Submenu */}
                                            <AnimatePresence>
                                                {item.children &&
                                                    expandedItems.includes(
                                                        item.label,
                                                    ) && (
                                                        <motion.div
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                height: "auto",
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex flex-col gap-4 pl-4 pt-6 border-l border-white/20 ml-2 mt-2">
                                                                {item.children.map(
                                                                    (child) =>
                                                                        child.href.startsWith(
                                                                            "http",
                                                                        ) ? (
                                                                            <a
                                                                                key={
                                                                                    child.label
                                                                                }
                                                                                href={
                                                                                    child.href
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                onClick={() =>
                                                                                    setIsOpen(
                                                                                        false,
                                                                                    )
                                                                                }
                                                                                className="font-baron text-lg text-[#d4af37] hover:text-white transition-colors tracking-wider uppercase"
                                                                            >
                                                                                {
                                                                                    child.label
                                                                                }
                                                                            </a>
                                                                        ) : (
                                                                            <Link
                                                                                key={
                                                                                    child.label
                                                                                }
                                                                                href={
                                                                                    child.href
                                                                                }
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    scrollToSection(
                                                                                        e,
                                                                                        child.href,
                                                                                    )
                                                                                }
                                                                                className="font-baron text-lg text-[#d4af37] hover:text-white transition-colors tracking-wider uppercase"
                                                                            >
                                                                                {
                                                                                    child.label
                                                                                }
                                                                            </Link>
                                                                        ),
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
