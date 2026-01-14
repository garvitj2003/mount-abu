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

const tableRowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            delay: i * 0.05,
        },
    }),
};

interface TenderItem {
    id: number;
    title: string;
    department: string;
    estimatedValue: string;
    bidClosingDate: string;
    pdfLink: string;
}

const tenderData: TenderItem[] = [
    {
        id: 1,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 2,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 3,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 4,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 5,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 6,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
    {
        id: 7,
        title: "Tender Title",
        department: "Department",
        estimatedValue: "Estimated Value",
        bidClosingDate: "Bid Closing Date",
        pdfLink: "#",
    },
];

const tableHeaders = [
    "Tender Title",
    "Department",
    "Estimated Value",
    "Bid Closing Date",
    "NIT Download (PDF)",
];

function TenderRow({ item, index }: { item: TenderItem; index: number }) {
    return (
        <motion.div
            custom={index}
            variants={tableRowVariants}
            className="flex items-center w-full"
        >
            {/* Tender Title */}
            <div className="flex-1 flex items-center justify-center px-[20px] py-[24px] bg-[rgba(0,0,0,0.4)] border-[0.844px] border-[rgba(255,255,255,0.1)]">
                <p className="font-montserrat font-normal text-[20px] text-[#f5f2e9] text-center">
                    {item.title}
                </p>
            </div>
            {/* Department */}
            <div className="flex-1 flex items-center justify-center px-[20px] py-[24px] bg-[rgba(0,0,0,0.4)] border-[0.844px] border-[rgba(255,255,255,0.1)]">
                <p className="font-montserrat font-light text-[20px] text-[#f5f2e9] text-center">
                    {item.department}
                </p>
            </div>
            {/* Estimated Value */}
            <div className="flex-1 flex items-center justify-center px-[20px] py-[24px] bg-[rgba(0,0,0,0.4)] border-[0.844px] border-[rgba(255,255,255,0.1)]">
                <p className="font-montserrat font-light text-[20px] text-[#f5f2e9] text-center">
                    {item.estimatedValue}
                </p>
            </div>
            {/* Bid Closing Date */}
            <div className="flex-1 flex items-center justify-center px-[20px] py-[24px] bg-[rgba(0,0,0,0.4)] border-[0.844px] border-[rgba(255,255,255,0.1)]">
                <p className="font-montserrat font-light text-[20px] text-[#f5f2e9] text-center">
                    {item.bidClosingDate}
                </p>
            </div>
            {/* Download PDF */}
            <div className="flex-1 flex items-center justify-center px-[20px] py-[24px] bg-[rgba(0,0,0,0.4)] border-[0.844px] border-[rgba(255,255,255,0.1)]">
                <a
                    href={item.pdfLink}
                    className="px-[24px] py-[10px] bg-[rgba(255,0,4,0.29)] backdrop-blur-[14.756px] rounded-[8px] hover:bg-[rgba(255,0,4,0.4)] transition-colors"
                >
                    <p className="font-montserrat font-medium text-[16px] text-white text-center">
                        Download PDF
                    </p>
                </a>
            </div>
        </motion.div>
    );
}

export default function ContactDiarySection() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#132019]/40 via-transparent to-[#132019]" />
            </div>

            {/* Content container */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] py-[80px]">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-[26px] items-center text-center mb-[80px]"
                >
                    <p className="font-baron text-[24px] text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
                        Contact Diary
                    </p>
                    <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px] max-w-[731px]">
                        Find The Right Municipal Officer And Contact Number In One Place.
                    </h2>
                </motion.div>

                {/* Table Container */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="w-full rounded-[20px] overflow-hidden"
                >
                    {/* Table Header */}
                    <div className="flex items-center w-full">
                        {tableHeaders.map((header, index) => (
                            <div
                                key={index}
                                className="flex-1 flex items-center justify-center px-[20px] py-[17.715px] bg-[#d49d37] border-[0.844px] border-[rgba(0,0,0,0.1)]"
                            >
                                <p className="font-montserrat font-medium text-[16px] text-white text-center">
                                    {header}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Table Body - Scrollable */}
                    <div className="max-h-[676px] overflow-y-auto custom-scrollbar">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex flex-col"
                        >
                            {tenderData.map((item, index) => (
                                <TenderRow
                                    key={item.id}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #633d2b;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #99654c;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b07860;
                }
            `}</style>
        </section>
    );
}
