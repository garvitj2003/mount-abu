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

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            delay: i * 0.1,
        },
    }),
};

interface ConnectCard {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    imageHeight: number;
}

const connectCards: ConnectCard[] = [
    {
        id: 1,
        title: "Facebook",
        description:
            "Follow updates, photos and announcements from Mount Abu Nagar Parishad.",
        image: "/images/connect-facebook.png",
        link: "#",
        imageHeight: 358,
    },
    {
        id: 2,
        title: "Instagram",
        description:
            "See visual stories of events, initiatives and life in Mount Abu.",
        image: "/images/connect-instagram.png",
        link: "#",
        imageHeight: 127,
    },
    {
        id: 3,
        title: "Twitter",
        description:
            "Get quick alerts, notices and service updates in real time.",
        image: "/images/connect-twitter.png",
        link: "#",
        imageHeight: 127,
    },
    {
        id: 4,
        title: "YouTube",
        description:
            "Watch event coverage, public messages and awareness videos.",
        image: "/images/connect-youtube.png",
        link: "#",
        imageHeight: 241,
    },
    {
        id: 5,
        title: "Helpline",
        description:
            "Call for service assistance, complaints or emergency municipal support.",
        image: "/images/connect-helpline.png",
        link: "#",
        imageHeight: 241,
    },
    {
        id: 6,
        title: "Office Address",
        description:
            "Visit the Nagar Parishad office for in-person support and submissions.",
        image: "/images/connect-address.png",
        link: "#",
        imageHeight: 136,
    },
];

function ConnectCard({
    card,
    index,
    className,
}: {
    card: ConnectCard;
    index: number;
    className?: string;
}) {
    // Determine a responsive height for images based on the card type
    const getImageHeight = () => {
        if (card.title === "Facebook") return "h-64 md:h-80";
        if (["Instagram", "Twitter", "Office Address"].includes(card.title)) return "h-32 md:h-40";
        return "h-48 md:h-56";
    };

    return (
        <motion.a
            href={card.link}
            custom={index}
            variants={cardVariants}
            className={`bg-[#f5f2e9] border border-black/20 rounded-xl overflow-hidden block hover:shadow-xl transition-shadow flex flex-col ${className}`}
        >
            {/* Image */}
            <div
                className={`relative w-full overflow-hidden rounded-b-2xl shrink-0 ${getImageHeight()}`}
            >
                <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                />
                {/* Inner shadow for Facebook card */}
                {card.title === "Facebook" && (
                    <div className="absolute inset-0 shadow-[inset_0px_-8px_40px_0px_rgba(0,0,0,0.2)]" />
                )}
            </div>

            {/* Content */}
            <div className="p-4 md:p-5 flex-grow">
                <h3 className="font-montserrat font-semibold text-lg md:text-xl text-black leading-tight mb-2">
                    {card.title}
                </h3>
                <p className="font-montserrat font-normal text-xs md:text-sm text-black/60 leading-normal line-clamp-3">
                    {card.description}
                </p>
            </div>
        </motion.a>
    );
}

export default function ConnectSection() {
    return (
        <section id="connect" className="relative w-full overflow-hidden bg-[#132019]">
            <div
                className="absolute top-0 left-0 w-full h-48 z-20 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

            {/* Background */}
            <div className="absolute inset-0">
                <Image
                    src="/images/sections/Contact.png"
                    alt=""
                    fill
                    className="object-cover opacity-30"
                />
            </div>

            {/* Content container */}
            <div className="relative z-30 container mx-auto px-4 md:px-8 py-16 md:py-24">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-4 items-center text-center mb-12 md:mb-16"
                >
                    <p className="font-baron text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] leading-normal">
                        Connect With Us
                    </p>
                    <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight max-w-3xl">
                        Stay Updated And Reach Out Anytime
                    </h2>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                >
                    {/* LEFT BLOCK: Spans 2 columns on desktop */}
                    <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
                        
                        {/* Top Row of Left Block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            {/* Column 1: Facebook */}
                            <ConnectCard
                                card={connectCards[0]}
                                index={0}
                                className="h-full"
                            />

                            {/* Column 2: Instagram + Twitter Stack */}
                            <div className="flex flex-col gap-5 md:gap-6">
                                <ConnectCard
                                    card={connectCards[1]}
                                    index={1}
                                    className="flex-1"
                                />
                                <ConnectCard
                                    card={connectCards[2]}
                                    index={2}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        {/* Bottom Row of Left Block: Office Address */}
                        <ConnectCard
                            card={connectCards[5]}
                            index={5}
                            className="w-full"
                        />
                    </div>

                    {/* RIGHT BLOCK: Column 3 */}
                    <div className="flex flex-col gap-5 md:gap-6">
                        <ConnectCard
                            card={connectCards[3]}
                            index={3}
                            className="flex-1"
                        />
                        <ConnectCard
                            card={connectCards[4]}
                            index={4}
                            className="flex-1"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}