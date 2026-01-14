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
            className={`flex flex-col gap-[24px] items-center p-[24px] rounded-[17px]
                backdrop-blur-[3px] bg-[rgba(19,32,25,0.2)]
                border border-[rgba(245,242,233,0.16)]
                w-[315px]
                ${isOffset ? "mt-[63px]" : ""}`}
        >
            {/* Image Container */}
            <div className="relative w-[267px] h-[230px] rounded-[12px] overflow-hidden shrink-0">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-[19px] items-start w-full">
                <h3 className="font-montserrat font-bold text-[24px] text-[#f5f2e9] capitalize leading-normal">
                    {service.title}
                </h3>
                <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]">
                    {service.description}
                </p>
                <a
                    href={service.link}
                    className="font-montserrat font-medium text-[14px] text-[#d4af37] underline underline-offset-2 hover:text-[#e5c048] transition-colors"
                >
                    Read More
                </a>
            </div>
        </motion.div>
    );
}

export default function ServicesSection() {
    return (
        <section className="relative w-full overflow-hidden">
          <div
              className="absolute top-0 left-0 w-full h-[200px] z-100"
              style={{
                  background:
                      "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
              }}
          />
          <div
              className="absolute bottom-0 left-0 w-full h-[150px] z-100"
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
            <div className="relative z-10 max-w-[1440px] mx-auto px-[37px] py-[82px]">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-[26px] items-center text-center mb-[60px]"
                >
                    <p className="font-baron text-[24px] text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
                        Services
                    </p>
                    <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
                        Streamlined Digital Services
                    </h2>
                </motion.div>

                {/* Service Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex justify-center gap-[35px] items-start"
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
