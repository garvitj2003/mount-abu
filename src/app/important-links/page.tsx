"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import { motion, Variants } from "motion/react";
import { ChevronDown } from "lucide-react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const linkGroups = [
  {
    title: "Boards",
    links: [
      "Board Of Secondary Education",
      "Rajasthan Board Of Technical Education,Rajasthan",
      "Rajasthan Housing Board (RHB)",
      "Rajasthan Revenue Board",
      "Rajasthan State Agriculture Marketing Board",
      "Rajasthan State Pollution Control Board (RSPCB)",
    ],
  },
  {
    title: "Bureaus",
    links: [
      "Bureau Of Investment Promotion (BIP), Rajasthan",
    ],
  },
  {
    title: "Corporations",
    links: [
      "Rajasthan Finance Corporation (RFC)",
      "Rajasthan State Industrial Development And Investment Corporation Limited (RIICO)",
      "Rajasthan State Mineral Development Corporation Limited (RSMDC)",
      "Rajasthan State Mines And Minerals Limited (RSMML)",
      "Rajasthan Tourism Development Corporation Limited (RTDC)",
    ],
  },
  {
    title: "Commissions",
    links: [
      "Rajasthan Electricity Regulatory Commission",
      "Rajasthan Public Service Commission",
      "Rajasthan State Human Rights Commission (RSHRC)",
      "State Election Commission, Rajasthan",
    ],
  },
  {
    title: "Government Departments",
    links: [
      "Rajasthan Government",
      "Agriculture Department",
      "Rajasthan Commercial Taxes Department",
      "Rajasthan Co-Operative Department",
      "Rajasthan Directorate Of Information And Public Relations",
      "Rajasthan Directorate Of Small Savings",
      "Rajasthan Education Department",
      "Rajasthan Employment Department",
      "Rajasthan Energy Department",
      "Rajasthan Excise Department",
      "Rajasthan Finance Department",
      "Rajasthan Forest Department",
      "Rajasthan Industries Department",
      "Rajasthan Irrigation Department",
      "Rajasthan Labour Department",
      "Medical, Health, Family Welfare And Ayurved Department, Rajasthan",
      "Rajasthan Mines And Geology Department",
      "Rajasthan Personnel Department",
      "Rajasthan Police Department",
      "Rajasthan Public Health Engineering Department",
      "Rajasthan Registration And Stamps Department",
      "Rajasthan Science And Technology Department",
      "Rajasthan Tourism Department Rajasthan",
    ],
  },
  {
    title: "Others",
    links: [
      "Centre For Disaster Management",
      "Chief Minister's Relief Fund, Rajasthan",
      "Kota Division, Rajasthan",
      "Lokmitra, Rajasthan",
      "Rajasthan Foundation",
      "Rajasthan Mobile Surgical Unit",
      "Rajasthan Urban Infrastructure Development Project (RUIDP)",
      "Centre For Development Of Stones (C-DOS)",
      "Rajasthan State Agency For Computer Services (Rajcomp)",
      "Rajasthan Hindi Granth Academy",
    ],
  },
];

export default function ImportantLinksPage() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("Department Name");

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="light" />

      <main className="flex-grow w-full pt-32 pb-20">
        {/* Title Section */}
        <section className="container mx-auto px-4 md:px-20.5 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex items-center gap-6"
              >
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center translate-y-2 hover:opacity-80 transition-opacity"
                >
                    <svg
                        width="28"
                        height="23"
                        viewBox="0 0 28 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="block"
                    >
                        <path
                            d="M1.07129 11.1126L26.0713 11.1126"
                            stroke="#2D4A2D"
                            strokeWidth="2.14286"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.1543 21.153L1.07096 11.113L11.1543 1.07129"
                            stroke="#2D4A2D"
                            strokeWidth="2.14286"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <h1 className="font-baron text-3xl md:text-5xl lg:text-6xl font-bold text-[#2D4A2D] tracking-tight">
                  Important Links
                </h1>
              </motion.div>

              {/* Department Select Filter */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex items-center bg-[#2D4A2D] rounded-lg p-1.5"
              >
                 <span className="text-white text-sm font-medium px-4">Select Department Name</span>
                 <div className="bg-[#FFFBEF] rounded-md px-4 py-2 flex items-center gap-4 cursor-pointer min-w-[200px] justify-between">
                    <span className="text-[#1C1C1C] text-sm">{selectedDepartment}</span>
                    <ChevronDown size={16} className="text-[#1C1C1C]" />
                 </div>
              </motion.div>
          </div>
        </section>

        {/* Links Grid */}
        <section className="container mx-auto px-4 md:px-20.5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-6 h-full">
                {[linkGroups[0], linkGroups[1], linkGroups[2], linkGroups[5]].map((group, index, arr) => (
                    <motion.div
                        key={`left-${index}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeIn}
                        className={`bg-[#F5F2E9] rounded-[20px] p-5 shadow-sm relative overflow-hidden flex ${index === arr.length - 1 ? 'flex-1' : ''}`}
                    >
                        {/* Side Strip */}
                        <div className="w-1.5 bg-[#416CC8] absolute left-0 top-0 bottom-0" />
                        
                        <div className="pl-4 w-full">
                            <h2 className="font-montserrat font-bold text-xl text-[#179362] mb-4">
                                {group.title}
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {group.links.map((link, idx) => (
                                    <li key={idx}>
                                        <a 
                                            href="#" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-montserrat font-semibold text-[15px] text-[#1C1C1C] leading-snug hover:text-black cursor-pointer transition-colors block"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6 h-full">
                {[linkGroups[3], linkGroups[4]].map((group, index, arr) => (
                    <motion.div
                        key={`right-${index}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeIn}
                        className={`bg-[#F5F2E9] rounded-[20px] p-5 shadow-sm relative overflow-hidden flex ${index === arr.length - 1 ? 'flex-1' : ''}`}
                    >
                        {/* Side Strip */}
                        <div className="w-1.5 bg-[#416CC8] absolute left-0 top-0 bottom-0" />
                        
                        <div className="pl-4 w-full">
                            <h2 className="font-montserrat font-bold text-xl text-[#179362] mb-4">
                                {group.title}
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {group.links.map((link, idx) => (
                                    <li key={idx}>
                                        <a 
                                            href="#" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-montserrat font-semibold text-[15px] text-[#1C1C1C] leading-snug hover:text-black cursor-pointer transition-colors block"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
              </div>
           </div>
        </section>

        {/* Bottom Wave (Optional, matching style of previous pages if needed, usually global layout handles footer) */}
      </main>

      <Footer />
    </div>
  );
}
