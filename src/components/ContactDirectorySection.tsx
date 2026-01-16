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
    <div className="w-[85vw] md:w-[700px] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Header: Name */}
              <th className="w-1/3 px-4 py-5 bg-[#d49d37] border-b border-white/10 border-r border-r-white/10">
                <p className="font-montserrat font-medium text-sm md:text-base text-white text-center">
                  Name
                </p>
              </th>
              {/* Header: Post */}
              <th className="w-1/3 px-4 py-5 bg-[#d49d37] border-b border-white/10 border-r border-r-white/10">
                <p className="font-montserrat font-medium text-sm md:text-base text-white text-center">
                  Post
                </p>
              </th>
              {/* Header: Department */}
              <th className="w-1/3 px-4 py-5 bg-[#d49d37] border-b border-white/10">
                <p className="font-montserrat font-medium text-sm md:text-base text-white text-center">
                  Department
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="bg-black/40">
            {table.officers.map((officer, idx) => (
              <tr
                key={idx}
                className="group hover:bg-white/5 transition-colors"
              >
                {/* Cell: Name */}
                <td className="p-4 border-b border-r border-white/10 align-middle">
                  <p className="font-montserrat font-normal text-sm md:text-base text-[#f5f2e9] text-center leading-tight">
                    {officer.name}
                  </p>
                </td>
                {/* Cell: Post */}
                <td className="p-4 border-b border-r border-white/10 align-middle">
                  <p className="font-montserrat font-light text-sm md:text-base text-[#f5f2e9] text-center">
                    {officer.post}
                  </p>
                </td>
                {/* Cell: Department */}
                <td className="p-4 border-b border-white/10 align-middle">
                  <p className="font-montserrat font-light text-sm md:text-base text-[#f5f2e9] text-center">
                    {officer.department}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ContactDirectorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('div')?.clientWidth || 700;
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + 40),
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('div')?.clientWidth || 700;
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 40,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-screen flex items-center py-16 md:py-24">
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
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#132019] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#132019] to-transparent z-10" />

      {/* Content container */}
      <div className="relative z-20 container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="flex flex-col gap-4 items-center text-center mb-12 md:mb-16"
        >
          <p className="font-baron text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] leading-normal uppercase">
            Contact Directory
          </p>
          <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight max-w-4xl">
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
            className="flex gap-8 md:gap-10 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-4"
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
          className="flex justify-center gap-5 mt-10"
        >
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full opacity-40 hover:opacity-60 transition-opacity"
            aria-label="Previous"
          >
            <Image
                src="/images/nav-prev.svg"
                alt="Previous"
                width={44}
                height={44}
                className="rotate-180"
            />
          </button>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full hover:opacity-80 transition-opacity"
            aria-label="Next"
          >
            <Image
                src="/images/nav-next.svg"
                alt="Next"
                width={44}
                height={44}
            />
          </button>
        </motion.div>
      </div>

      {/* Hide scrollbar utility */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}