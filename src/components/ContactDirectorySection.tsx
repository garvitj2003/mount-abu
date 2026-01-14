"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";
import { useRef } from "react";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

interface Officer {
    name: string;
    post: string;
}

interface ContactTable {
    id: number;
    officers: Officer[];
}

const contactTables: ContactTable[] = [
    {
        id: 1,
        officers: [
            { name: "श्री आयुष्व्रत आचार्य", post: "आयुक्त" },
            { name: "श्री नवदीप सिंह राजपुरोहित", post: "सहायक अभियंता" },
            { name: "श्री ललित कुमार माथुर", post: "सहायक अभियंता" },
            { name: "श्री लक्ष्मण कुमार", post: "कनिष्ठ अभियंता (सिविल)" },
            { name: "श्री गजेन्द्र सिंह", post: "कनिष्ठ अभियंता (विद्युत)" },
            { name: "श्री महेन्द्र कुमार बंजारा", post: "राजस्व निरीक्षक" },
            { name: "श्री प्रमोद चन्देल", post: "सहायक राजस्व निरीक्षक" },
            { name: "श्री रमेश चन्द्र रोहिण", post: "वरिष्ठ सहायक" },
        ],
    },
    {
        id: 2,
        officers: [
            { name: "श्री पंकज माथुर", post: "कनिष्ठ सहायक" },
            { name: "श्रीमती नीता राणा", post: "कनिष्ठ सहायक" },
            { name: "श्री धीरजमल कुमावत", post: "कनिष्ठ सहायक" },
            { name: "सुश्री शिल्पा बिष्ट", post: "कनिष्ठ सहायक" },
            { name: "श्री आदिमान", post: "कनिष्ठ सहायक" },
            { name: "सुश्री आशा कंवर", post: "कनिष्ठ सहायक" },
            { name: "श्री कुशल", post: "कनिष्ठ सहायक" },
            { name: "श्री राजकिशोर शर्मा", post: "नाकेवर" },
        ],
    },
    {
        id: 3,
        officers: [
            { name: "श्री दिनेश कुमार", post: "कनिष्ठ सहायक" },
            { name: "श्री तरुण", post: "कनिष्ठ सहायक" },
            { name: "श्री मनोज कुमार", post: "कनिष्ठ सहायक" },
            { name: "श्री दिलीप कुमार", post: "कनिष्ठ सहायक" },
            { name: "श्री भैराराम", post: "कनिष्ठ सहायक" },
            { name: "श्री विक्रम कुमार", post: "कनिष्ठ सहायक" },
            { name: "श्री संजय राणा", post: "कनिष्ठ सहायक" },
            { name: "श्री ललित भाट", post: "कनिष्ठ सहायक" },
        ],
    },
];

function ContactTableCard({ table }: { table: ContactTable }) {
    return (
        <div className="w-[410px] shrink-0 rounded-[8px] overflow-hidden">
            {/* Header */}
            <div className="flex bg-[#d49d37]">
                <div className="w-[140px] px-[16px] py-[10px] text-center">
                    <p className="font-montserrat font-medium text-[14px] text-white">
                        Name
                    </p>
                </div>
                <div className="flex-1 px-[16px] py-[10px] text-center">
                    <p className="font-montserrat font-medium text-[14px] text-white">
                        Post
                    </p>
                </div>
            </div>

            {/* Rows */}
            {table.officers.map((officer, idx) => (
                <div
                    key={idx}
                    className="flex bg-[rgba(245,242,233,0.75)] backdrop-blur-[2px] border-b border-[rgba(0,0,0,0.08)]"
                >
                    {/* Name */}
                    <div className="w-[140px] px-[12px] py-[16px] border-r border-[rgba(0,0,0,0.06)]">
                        <p className="font-montserrat font-medium text-[13px] text-[#333] text-center leading-[1.3]">
                            {officer.name}
                        </p>
                    </div>
                    {/* Post */}
                    <div className="w-[130px] px-[12px] py-[16px] border-r border-[rgba(0,0,0,0.06)]">
                        <p className="font-montserrat font-normal text-[13px] text-[#555] text-center leading-[1.3]">
                            {officer.post}
                        </p>
                    </div>
                    {/* Department */}
                    <div className="flex-1 px-[12px] py-[16px]">
                        <p className="font-montserrat font-normal text-[13px] text-[#888] text-center">
                            Department
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ContactDirectorySection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -430,
                behavior: "smooth",
            });
        }
    };

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 430,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="relative w-full overflow-hidden min-h-[900px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/contact-directory-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                    style={{ mixBlendMode: "difference", opacity: 0.65 }}
                />
                <div
                    className="absolute inset-0 bg-[#5a5040]"
                    style={{ mixBlendMode: "multiply" }}
                />
            </div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-[#132019] to-transparent z-[1]" />
            <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-[#132019] to-transparent z-[1]" />

            {/* Content container */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-[60px] py-[80px]">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-[26px] items-center text-center mb-[50px]"
                >
                    <p className="font-baron text-[24px] text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
                        Contact Diary
                    </p>
                    <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px] max-w-[800px]">
                        Find The Right Municipal Officer And Contact Number In One Place.
                    </h2>
                </motion.div>

                {/* Tables Container - Horizontal Scroll */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="relative"
                >
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-[20px] overflow-x-auto pb-[20px] scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {contactTables.map((table) => (
                            <ContactTableCard key={table.id} table={table} />
                        ))}
                    </div>
                </motion.div>

                {/* Navigation Arrows */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="flex justify-center gap-[12px] mt-[30px]"
                >
                    <button
                        onClick={handlePrev}
                        className="w-[44px] h-[44px] flex items-center justify-center opacity-50 hover:opacity-80 transition-opacity rotate-180"
                        aria-label="Previous"
                    >
                        <Image
                            src="/images/nav-arrow-next.svg"
                            alt=""
                            width={44}
                            height={44}
                        />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-[44px] h-[44px] flex items-center justify-center hover:opacity-80 transition-opacity"
                        aria-label="Next"
                    >
                        <Image
                            src="/images/nav-arrow-next.svg"
                            alt=""
                            width={44}
                            height={44}
                        />
                    </button>
                </motion.div>
            </div>

            {/* Hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
