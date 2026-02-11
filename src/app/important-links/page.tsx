"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import { motion, Variants, AnimatePresence } from "motion/react";
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
      { name: "Board Of Secondary Education", url: "https://rajeduboard.rajasthan.gov.in/" },
      { name: "Rajasthan Board Of Technical Education, Rajasthan", url: "https://techedu.rajasthan.gov.in/home/dptHome" },
      { name: "Rajasthan Housing Board (RHB)", url: "https://rhb.rajasthan.gov.in/content/raj/rhb/en/home.html" },
      { name: "Rajasthan Revenue Board", url: "https://landrevenue.rajasthan.gov.in/content/landrevenuenew/en/board-of-revenue-for-raj-dep.html" },
      { name: "Rajasthan State Agriculture Marketing Board", url: "https://agriculture.rajasthan.gov.in/dam/#/home/dptHome" },
      { name: "Rajasthan State Pollution Control Board (RSPCB)", url: "https://environment.rajasthan.gov.in/rpcb" },
    ],
  },
  {
    title: "Bureaus",
    links: [
      { name: "Bureau of Investment Promotion (BIP), Rajasthan", url: "https://rising.rajasthan.gov.in/about-bip" },
    ],
  },
  {
    title: "Corporations",
    links: [
      { name: "Rajasthan Finance Corporation (RFC)", url: "https://rfc.rajasthan.gov.in/home/dptHome" },
      { name: "Rajasthan State Industrial Development And Investment Corporation Limited (RIICO)", url: "https://riico.rajasthan.gov.in/" },
      { name: "Rajasthan State Mineral Development Corporation Limited (RSMDC)", url: "#" },
      { name: "Rajasthan State Mines And Minerals Limited (RSMML)", url: "https://www.rsmm.com/" },
      { name: "Rajasthan Tourism Development Corporation Limited (RTDC)", url: "https://rtdc.tourism.rajasthan.gov.in/" },
    ],
  },
  {
    title: "Commissions",
    links: [
      { name: "Rajasthan Electricity Regulatory Commission", url: "https://rerc.rajasthan.gov.in/" },
      { name: "Rajasthan Public Service Commission", url: "https://rpsc.rajasthan.gov.in/" },
      { name: "Rajasthan State Human Rights Commission (RSHRC)", url: "https://rshrc.rajasthan.gov.in/" },
      { name: "State Election Commission, Rajasthan", url: "https://sec.rajasthan.gov.in/" },
    ],
  },
  {
    title: "Government Departments",
    links: [
      { name: "Rajasthan Government", url: "https://rajasthan.gov.in/" },
      { name: "Agriculture Department", url: "https://agriculture.rajasthan.gov.in/home" },
      { name: "Rajasthan Commercial Taxes Department", url: "http://rajtax.gov.in/vatweb/" },
      { name: "Rajasthan Co-Operative Department", url: "https://rajsahakar.rajasthan.gov.in/" },
      { name: "Rajasthan Directorate Of Information And Public Relations", url: "https://dipr.rajasthan.gov.in/home" },
      { name: "Rajasthan Directorate Of Small Savings", url: "https://dta.rajasthan.gov.in/" },
      { name: "Rajasthan Education Department", url: "https://education.rajasthan.gov.in/home" },
      { name: "Rajasthan Employment Department", url: "https://employment.livelihoods.rajasthan.gov.in/website/" },
      { name: "Rajasthan Energy Department", url: "https://energy.rajasthan.gov.in/home" },
      { name: "Rajasthan Excise Department", url: "https://excise.rajasthan.gov.in/" },
      { name: "Rajasthan Finance Department", url: "https://finance.rajasthan.gov.in/website/" },
      { name: "Rajasthan Forest Department", url: "https://forest.rajasthan.gov.in/content/raj/forest/en/home.html" },
      { name: "Rajasthan Industries Department", url: "https://industries.rajasthan.gov.in/home" },
      { name: "Rajasthan Irrigation Department", url: "https://water.rajasthan.gov.in/home" },
      { name: "Rajasthan Labour Department", url: "https://labour.rajasthan.gov.in/" },
      { name: "Medical, Health, Family Welfare And Ayurved Department, Rajasthan", url: "https://rajswasthya.rajasthan.gov.in/" },
      { name: "Rajasthan Mines And Geology Department", url: "https://mines.rajasthan.gov.in/dmgcms/page?menuName=Home" },
      { name: "Rajasthan Personnel Department", url: "https://dop.rajasthan.gov.in/" },
      { name: "Rajasthan Police Department", url: "https://police.rajasthan.gov.in/portal/dashboard" },
      { name: "Rajasthan Public Health Engineering Department", url: "https://phed.rajasthan.gov.in/" },
      { name: "Rajasthan Registration And Stamps Department", url: "https://igrs.rajasthan.gov.in/home/dptHome" },
      { name: "Rajasthan Science And Technology Department.", url: "https://dst.rajasthan.gov.in/" },
      { name: "Rajasthan Tourism Department Rajasthan", url: "https://www.tourism.rajasthan.gov.in/#modal-one" },
    ],
  },
  {
    title: "Others",
    links: [
      { name: "Centre For Disaster Management", url: "https://home.rajasthan.gov.in/content/homeportal/en/sardarpateluniversityportal/academics/centers/cdmis.html" },
      { name: "Chief Minister's Relief Fund, Rajasthan", url: "https://cmrf.rajasthan.gov.in/cmrf/" },
      { name: "Kota Division, Rajasthan", url: "https://kota.rajasthan.gov.in/home/dptHome" },
      { name: "Lokmitra, Rajasthan", url: "https://emitra.rajasthan.gov.in/emitra/home" },
      { name: "Rajasthan Foundation", url: "https://foundation.rajasthan.gov.in/" },
      { name: "Rajasthan Mobile Surgical Unit", url: "https://health.rajasthan.gov.in/home" },
      { name: "Rajasthan Urban Infrastructure Development Project (RUIDP)", url: "https://www.lsg.urban.rajasthan.gov.in/content/raj/udh/ruidp/en/home.html" },
      { name: "Centre For Development Of Stones (C-DOS)", url: "https://cdos-india.com/" },
      { name: "Rajasthan State Agency For Computer Services (Rajcomp)", url: "https://risl.rajasthan.gov.in/" },
      { name: "Rajasthan Hindi Granth Academy", url: "https://rajhga.com/Page3.aspx" },
    ],
  },
];

export default function ImportantLinksPage() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ["All Departments", ...linkGroups.map(g => g.title)];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const leftColumnGroups = selectedDepartment === "All Departments"
    ? [linkGroups[0], linkGroups[1], linkGroups[2], linkGroups[5]]
    : linkGroups.filter(g => g.title === selectedDepartment);
  
  const rightColumnGroups = selectedDepartment === "All Departments"
    ? [linkGroups[3], linkGroups[4]]
    : [];

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
                className="flex items-center bg-[#2D4A2D] rounded-lg p-1.5 relative"
                ref={dropdownRef}
              >
                 <span className="text-white text-sm font-medium px-4 hidden sm:block">Select Department Name</span>
                 <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#FFFBEF] rounded-md px-4 py-2 flex items-center gap-4 cursor-pointer min-w-[200px] justify-between"
                 >
                    <span className="text-[#1C1C1C] text-sm">{selectedDepartment}</span>
                    <ChevronDown size={16} className={`text-[#1C1C1C] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                 </div>

                 <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#FFFBEF] border border-[#2D4A2D]/20 rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        {options.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSelectedDepartment(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`px-6 py-3 text-sm cursor-pointer transition-colors hover:bg-[#2D4A2D] hover:text-white ${
                              selectedDepartment === option ? 'bg-[#2D4A2D] text-white' : 'text-[#1C1C1C]'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
          </div>
        </section>

        {/* Links Grid */}
        <section className="container mx-auto px-4 md:px-20.5">
           <div className={`grid grid-cols-1 ${selectedDepartment === "All Departments" ? 'md:grid-cols-2' : 'max-w-3xl'} gap-6`}>
              {/* Left Column */}
              <div className="flex flex-col gap-6 h-full">
                {leftColumnGroups.map((group, index, arr) => (
                    <motion.div
                        key={`left-${group.title}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeIn}
                        className={`bg-[#F5F2E9] rounded-[20px] p-5 shadow-sm relative overflow-hidden flex ${index === arr.length - 1 && selectedDepartment === "All Departments" ? 'flex-1' : ''}`}
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
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-montserrat font-semibold text-[15px] text-[#1C1C1C] leading-snug hover:text-black cursor-pointer transition-colors block"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
              </div>

              {/* Right Column */}
              {selectedDepartment === "All Departments" && (
                <div className="flex flex-col gap-6 h-full">
                  {rightColumnGroups.map((group, index, arr) => (
                      <motion.div
                          key={`right-${group.title}`}
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
                                              href={link.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="font-montserrat font-semibold text-[15px] text-[#1C1C1C] leading-snug hover:text-black cursor-pointer transition-colors block"
                                          >
                                              {link.name}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </motion.div>
                  ))}
                </div>
              )}
           </div>
        </section>

        {/* Bottom Wave (Optional, matching style of previous pages if needed, usually global layout handles footer) */}
      </main>

      <Footer />
    </div>
  );
}
