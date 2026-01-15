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
  department: string;
}

interface ContactTable {
  id: number;
  officers: Officer[];
}

const contactTables: ContactTable[] = [
  {
    id: 1,
    officers: [
      { name: "श्री आयुष्व्रत आचार्य", post: "आयुक्त", department: "Department" },
      { name: "श्री नवदीप सिंह राजपुरोहित", post: "सहायक अभियंता", department: "Department" },
      { name: "श्री ललित कुमार माथुर", post: "सहायक अभियंता", department: "Department" },
      { name: "श्री लक्ष्मण कुमार", post: "कनिष्ठ अभियंता (सिविल)", department: "Department" },
      { name: "श्री गजेन्द्र सिंह", post: "कनिष्ठ अभियंता (विद्युत)", department: "Department" },
      { name: "श्री महेन्द्र कुमार बंजारा", post: "राजस्व निरीक्षक", department: "Department" },
      { name: "श्री प्रमोद चन्देल", post: "सहायक राजस्व निरीक्षक", department: "Department" },
      { name: "श्री रमेश चन्द्र रोहिण", post: "वरिष्ठ सहायक", department: "Department" },
    ],
  },
  {
    id: 2,
    officers: [
      { name: "श्री पंकज माथुर", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्रीमती नीता राणा", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री धीरजमल कुमावत", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "सुश्री शिल्पा बिष्ट", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री आदिमान", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "सुश्री आशा कंवर", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री कुशल", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री राजकिशोर शर्मा", post: "नाकेवर", department: "Department" },
    ],
  },
  {
    id: 3,
    officers: [
      { name: "श्री दिनेश कुमार", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री तरुण", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री मनोज कुमार", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री दिलीप कुमार", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री भैराराम", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री विक्रम कुमार", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री संजय राणा", post: "कनिष्ठ सहायक", department: "Department" },
      { name: "श्री ललित भाट", post: "कनिष्ठ सहायक", department: "Department" },
    ],
  },
];

function ContactTableCard({ table }: { table: ContactTable }) {
  return (
    // Increased width to 700px to accommodate 3 columns
    <div className="w-[700px] shrink-0 rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.1)]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Header: Name */}
            <th className="w-1/3 px-4 py-[18px] bg-[#d49d37] border-b border-[rgba(255,255,255,0.1)] border-r border-r-[rgba(255,255,255,0.1)]">
              <p className="font-montserrat font-medium text-[16px] text-white text-center">
                Name
              </p>
            </th>
            {/* Header: Post */}
            <th className="w-1/3 px-4 py-[18px] bg-[#d49d37] border-b border-[rgba(255,255,255,0.1)] border-r border-r-[rgba(255,255,255,0.1)]">
              <p className="font-montserrat font-medium text-[16px] text-white text-center">
                Post
              </p>
            </th>
            {/* Header: Department */}
            <th className="w-1/3 px-4 py-[18px] bg-[#d49d37] border-b border-[rgba(255,255,255,0.1)]">
              <p className="font-montserrat font-medium text-[16px] text-white text-center">
                Department
              </p>
            </th>
          </tr>
        </thead>
        <tbody className="bg-[rgba(0,0,0,0.4)]">
          {table.officers.map((officer, idx) => (
            <tr
              key={idx}
              className="group hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {/* Cell: Name */}
              <td className="p-4 border-b border-r border-[rgba(255,255,255,0.1)] align-middle">
                <p className="font-montserrat font-normal text-[16px] text-[#f5f2e9] text-center leading-tight">
                  {officer.name}
                </p>
              </td>
              {/* Cell: Post */}
              <td className="p-4 border-b border-r border-[rgba(255,255,255,0.1)] align-middle">
                <p className="font-montserrat font-light text-[16px] text-[#f5f2e9] text-center">
                  {officer.post}
                </p>
              </td>
              {/* Cell: Department */}
              <td className="p-4 border-b border-[rgba(255,255,255,0.1)] align-middle">
                <p className="font-montserrat font-light text-[16px] text-[#f5f2e9] text-center">
                  {officer.department}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ContactDirectorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Width of card (700px) + Gap (40px) = 740px scroll distance
  const SCROLL_AMOUNT = 740;

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[900px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/sections/Tenders.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Gradient overlays for smooth transitions */}
      <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-[#132019] to-transparent z-1" />
      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-[#132019] to-transparent z-1" />

      {/* Content container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[40px] py-[80px]">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="flex flex-col gap-[26px] items-center text-center mb-[60px]"
        >
          <p className="font-baron text-[24px] text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
            Contact Diary
          </p>
          <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px] max-w-[800px]">
            Find The Right Municipal Officer And Contact Number In One Place.
          </h2>
        </motion.div>

        {/* Horizontal Scrollable Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative w-full"
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-[40px] overflow-x-auto pb-[20px] scrollbar-hide snap-x snap-mandatory px-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {contactTables.map((table) => (
              <div key={table.id} className="snap-center">
                <ContactTableCard table={table} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Arrows */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="flex justify-center gap-[20px] mt-[40px]"
        >
          <button
            onClick={handlePrev}
            className="w-[50px] h-[50px] flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.3)] hover:bg-[#d49d37] hover:border-[#d49d37] transition-all duration-300 group"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="w-[50px] h-[50px] flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.3)] hover:bg-[#d49d37] hover:border-[#d49d37] transition-all duration-300 group"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Hide scrollbar utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}