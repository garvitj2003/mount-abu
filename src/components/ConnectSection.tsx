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
    return (
        <motion.a
            href={card.link}
            custom={index}
            variants={cardVariants}
            className={`bg-[#f5f2e9] border border-[rgba(0,0,0,0.2)] rounded-[9px] overflow-hidden block hover:shadow-xl transition-shadow ${className}`}
        >
            {/* Image */}
            <div
                className="relative w-full overflow-hidden rounded-b-[20px]"
                style={{ height: card.imageHeight }}
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
            <div className="p-[18px] pt-[16px]">
                <h3 className="font-montserrat font-semibold text-[23px] text-black leading-[1.25] mb-[9px]">
                    {card.title}
                </h3>
                <p className="font-montserrat font-normal text-[14px] text-[rgba(0,0,0,0.4)] leading-[1.2]">
                    {card.description}
                </p>
            </div>
        </motion.a>
    );
}

export default function ConnectSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#132019]">
            <div
                className="absolute top-0 left-0 w-full h-[200px] z-20 pointer-events-none"
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
            <div className="relative z-10 max-w-[1270px] mx-auto px-[40px] py-[80px]">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-[26px] items-center text-center mb-[60px]"
                >
                    <p className="font-baron text-[24px] text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
                        Connect With Us
                    </p>
                    <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
                        Stay Updated And Reach Out Anytime
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-3 gap-[21px] h-[729px]"
                >
                    {/* Column 1 - Facebook (tall) + Office Address (bottom part) */}
                    <div className="flex flex-col gap-[13px]">
                        <ConnectCard
                            card={connectCards[0]}
                            index={0}
                            className="h-[482px]"
                        />
                    </div>

                    {/* Column 2 - Instagram + Twitter + Office Address (spans) */}
                    <div className="flex flex-col gap-[13px]">
                        <ConnectCard
                            card={connectCards[1]}
                            index={1}
                            className="h-[234px]"
                        />
                        <ConnectCard
                            card={connectCards[2]}
                            index={2}
                            className="h-[234px]"
                        />
                    </div>

                    {/* Column 3 - YouTube + Helpline */}
                    <div className="flex flex-col gap-[16px]">
                        <ConnectCard
                            card={connectCards[3]}
                            index={3}
                            className="h-[362px]"
                        />
                        <ConnectCard
                            card={connectCards[4]}
                            index={4}
                            className="h-[350px]"
                        />
                    </div>
                </motion.div>

                {/* Office Address - spanning first two columns at bottom */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mt-[-221px] ml-0"
                    style={{ width: "839px" }}
                >
                    <ConnectCard
                        card={connectCards[5]}
                        index={5}
                        className="h-[234px]"
                    />
                </motion.div>
            </div>
        </section>
    );
}
