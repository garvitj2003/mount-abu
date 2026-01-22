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
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: i * 0.15,
        },
    }),
};

interface ServiceItem {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
}

const services: ServiceItem[] = [
    {
        id: 1,
        title: "Digital Construction Token",
        description: "Instant eco-zone approvals with QR token generation",
        image: "/images/service-construction.png",
        link: "#",
    },
    {
        id: 2,
        title: "Complaint Redressal & Tracking",
        description: "File complaints without login, get real-time SMS updates",
        image: "/images/service-complaint.png",
        link: "#",
    },
    {
        id: 3,
        title: "Vital Certificates (Birth/Death)",
        description: "Instant download from government portal",
        image: "/images/service-certificates.png",
        link: "#",
    },
    {
        id: 4,
        title: "Marriage Certificate",
        description: "Register marriage digitally, get certified copy online",
        image: "/images/service-marriage.png",
        link: "#",
    },
];

function ServiceCard({
    service,
    index,
}: {
    service: ServiceItem;
    index: number;
}) {
    const isOffset = index === 1 || index === 3;

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            className={`flex flex-col gap-6 items-center p-6 rounded-2xl z-20
                backdrop-blur-sm bg-[rgba(19,32,25,0.2)]
                border border-[rgba(245,242,233,0.16)]
                w-full
                ${isOffset ? "lg:mt-16" : ""}`}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 items-start w-full">
                <h3 className="font-montserrat font-bold text-xl md:text-2xl text-[#f5f2e9] capitalize leading-tight">
                    {service.title}
                </h3>
                <p className="font-montserrat font-medium text-base md:text-lg text-[#f5f2e9] leading-relaxed">
                    {service.description}
                </p>
                <a
                    href={service.link}
                    className="font-montserrat cursor-pointer font-medium text-sm text-[#d4af37] underline underline-offset-4 hover:text-[#e5c048] transition-colors"
                >
                    Read More
                </a>
            </div>
        </motion.div>
    );
}

export default function ServicesSection() {
    return (
        <section id="services" className="relative w-full overflow-hidden">
            <div
                className="absolute top-0 left-0 w-full h-48 md:h-64 z-10"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-40 md:h-52 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/sections/Services.png"
                    alt=""
                    fill
                    className="object-cover"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#132019]/60 via-[#132019]/50 to-[#132019]/70" />
            </div>

            {/* Content container */}
            <div className="relative z-20 container mx-auto px-4 md:px-8 py-16 md:py-24">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-4 items-center text-center mb-12 md:mb-16"
                >
                    <p className="font-baron text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
                        Services
                    </p>
                    <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight">
                        Streamlined Digital Services
                    </h2>
                </motion.div>

                {/* Service Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start"
                >
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
