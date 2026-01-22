"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";

// Animation for the table container
const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

// Animation for individual rows
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
        title: "Road Construction",
        department: "Civil Works",
        estimatedValue: "₹ 50,00,000",
        bidClosingDate: "2024-10-15",
        pdfLink: "#",
    },
    {
        id: 2,
        title: "Street Light Supply",
        department: "Electrical",
        estimatedValue: "₹ 12,00,000",
        bidClosingDate: "2024-10-20",
        pdfLink: "#",
    },
    {
        id: 3,
        title: "Park Maintenance",
        department: "Horticulture",
        estimatedValue: "₹ 8,00,000",
        bidClosingDate: "2024-10-22",
        pdfLink: "#",
    },
    {
        id: 4,
        title: "Waste Management",
        department: "Sanitation",
        estimatedValue: "₹ 25,00,000",
        bidClosingDate: "2024-10-25",
        pdfLink: "#",
    },
    {
        id: 5,
        title: "IT Equipment",
        department: "Technology",
        estimatedValue: "₹ 15,00,000",
        bidClosingDate: "2024-10-28",
        pdfLink: "#",
    },
    {
        id: 6,
        title: "Water Supply Pipe",
        department: "Hydraulics",
        estimatedValue: "₹ 30,00,000",
        bidClosingDate: "2024-10-30",
        pdfLink: "#",
    },
    {
        id: 7,
        title: "Building Renovation",
        department: "Civil Works",
        estimatedValue: "₹ 45,00,000",
        bidClosingDate: "2024-11-01",
        pdfLink: "#",
    },
    {
        id: 8,
        title: "Solar Panel Install",
        department: "Electrical",
        estimatedValue: "₹ 60,00,000",
        bidClosingDate: "2024-11-05",
        pdfLink: "#",
    },
    {
        id: 9,
        title: "Drainage Cleaning",
        department: "Sanitation",
        estimatedValue: "₹ 10,00,000",
        bidClosingDate: "2024-11-08",
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

export default function Tenders() {
    return (
        <section id="tenders" className="relative w-full overflow-hidden py-10">
            {/* Gradients */}
            <div
                className="absolute top-0 left-0 w-full h-48 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-40 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/sections/Tenders.png"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 py-16 md:py-24">
                {/* Header Content */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="flex flex-col gap-6 items-center text-center mb-12 md:mb-16"
                >
                    <h1 className="font-baron text-xl md:text-2xl text-[#d4af37] tracking-tight uppercase ">
                        Tender
                    </h1>
                    <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight max-w-3xl">
                        View active municipal tenders with key details and NIT
                        downloads.
                    </h2>
                </motion.div>

                {/* TABLE CONTAINER */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="w-full overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.1)] max-h-[70vh] custom-scrollbar"
                >
                    <table className="w-full min-w-[800px] border-collapse relative">
                        {/* STICKY HEADER */}
                        <thead className="sticky top-0 z-20">
                            <tr>
                                {tableHeaders.map((header, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-5 bg-[#d49d37] border-b border-[rgba(255,255,255,0.1)] w-1/5"
                                    >
                                        <p className="font-montserrat font-medium text-base text-white text-center whitespace-nowrap">
                                            {header}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
                        <tbody className="bg-[rgba(0,0,0,0.4)]">
                            {tenderData.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    custom={index}
                                    variants={tableRowVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <td className="p-4 border-[0.844px] border-[rgba(255,255,255,0.1)] align-middle">
                                        <p className="font-montserrat font-normal text-base md:text-lg text-[#f5f2e9] text-center leading-tight">
                                            {item.title}
                                        </p>
                                    </td>
                                    <td className="p-4 border-[0.844px] border-[rgba(255,255,255,0.1)] align-middle">
                                        <p className="font-montserrat font-light text-base md:text-lg text-[#f5f2e9] text-center">
                                            {item.department}
                                        </p>
                                    </td>
                                    <td className="p-4 border-[0.844px] border-[rgba(255,255,255,0.1)] align-middle">
                                        <p className="font-montserrat font-light text-base md:text-lg text-[#f5f2e9] text-center">
                                            {item.estimatedValue}
                                        </p>
                                    </td>
                                    <td className="p-4 border-[0.844px] border-[rgba(255,255,255,0.1)] align-middle">
                                        <p className="font-montserrat font-light text-base md:text-lg text-[#f5f2e9] text-center">
                                            {item.bidClosingDate}
                                        </p>
                                    </td>
                                    <td className="p-4 border-[0.844px] border-[rgba(255,255,255,0.1)] align-middle">
                                        <div className="flex justify-center">
                                            <a
                                                href={item.pdfLink}
                                                className="px-6 py-2 bg-[rgba(255,0,4,0.29)] backdrop-blur-md rounded-lg hover:bg-[rgba(255,0,4,0.4)] transition-colors inline-block"
                                            >
                                                <p className="font-montserrat font-medium text-sm text-white text-center whitespace-nowrap">
                                                    Download PDF
                                                </p>
                                            </a>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>

            {/* USING GLOBAL STYLES TO FORCE OVERRIDE
         Includes both WebKit (Chrome/Safari) and Firefox standard properties.
      */}
            <style jsx global>{`
                /* Reset table borders */
                table {
                    border-collapse: collapse;
                    border-spacing: 0;
                }

                /* --- FIREFOX --- */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(212, 157, 55, 0.5) transparent;
                }

                /* --- CHROME / EDGE / SAFARI --- */

                /* 1. Track is completely transparent */
                .custom-scrollbar::-webkit-scrollbar-track {
                    background-color: transparent;
                }

                /* 2. Width of the scrollbar container */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px; /* Slightly wider to accommodate the visual "padding" */
                    background-color: transparent;
                }

                /* 3. The draggable Thumb */
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    /* Use background-clip to simulate padding/margin around the scrollbar */
                    background-color: rgba(212, 157, 55, 0.5);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }

                /* 4. Hover state */
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(212, 157, 55, 0.8);
                }
            `}</style>
        </section>
    );
}
