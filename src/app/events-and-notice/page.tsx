"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import { motion, Variants } from "motion/react";
import { Calendar, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { events, notices } from "@/data/events";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function EventsAndNoticesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="light" />

      <main className="flex-grow w-full pt-32 pb-20">
        {/* Title Section */}
        <section className="container mx-auto px-4 md:px-20.5 mb-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex items-center gap-6"
          >
            <button
                onClick={() => router.push("/")}
                className="flex items-center translate-y-2"
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
            <h1 className="font-baron leading-none text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D4A2D] tracking-tight">
              Events and notices
            </h1>
          </motion.div>
        </section>

        {/* Events Section */}
        <section className="container mx-auto px-4 md:px-20.5 py-8">
          {/* Header & Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <h2 className="font-baron text-2xl font-bold text-[#1B261D] uppercase tracking-wide">Events</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Event Type */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                <span className="text-sm font-onest text-[#343434]">Event Type</span>
                <ChevronDown size={14} className="text-[#343434]" />
              </div>
              
              <div className="hidden sm:block w-[1px] h-6 bg-[#D6D9DE]"></div>

              {/* Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                <span className="text-sm font-onest text-[#343434]">All Status</span>
                <ChevronDown size={14} className="text-[#343434]" />
              </div>

              <div className="hidden sm:block w-[1px] h-6 bg-[#D6D9DE]"></div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                    <span className="text-sm font-onest text-[#343434]">From </span>
                    <Calendar size={14} className="text-[#343434]" />
                  </div>
                  <span className="text-[#2D4A2D]">-</span>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                    <span className="text-sm font-onest text-[#343434]">To</span>
                     <Calendar size={14} className="text-[#343434]" />
                  </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link href={`/events-and-notice/${event.id}`} key={event.id} className="block h-full">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeIn}
                    className="bg-[#F5F2E9] border border-[#2D4A2D] rounded-[24px] overflow-hidden flex flex-col relative group h-full hover:shadow-lg transition-shadow"
                >
                    {/* Image Section */}
                    <div className="relative h-[240px] w-full">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                        
                        {/* Status Badge - Top Right */}
                        <div className="absolute top-4 right-0 z-10 bg-[#D4AF37] border-y border-l border-[#000000] text-black px-2 py-2 rounded-l-lg font-montserrat font-medium text-xs">
                            {event.status}
                        </div>

                        {/* Location Bar - Bottom of Image */}
                        <div className="absolute bottom-0 left-0 w-full bg-[#2D4A2D] text-white px-4 py-2 flex items-center gap-2">
                            <div className="w-5 h-5 relative shrink-0">
                            <Image 
                                src="/images/icons/location-tick.svg" 
                                alt="Location" 
                                fill
                                className="object-contain"
                            />
                            </div>
                            <span className="text-sm font-medium truncate">{event.location}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 pt-6 flex flex-col flex-grow relative">
                    <span className="text-sm text-[#333333] mb-2">{event.tag}</span>
                    <h3 className="font-montserrat font-bold text-xl text-[#2D4A2D] leading-tight mb-4 pr-12">
                        {event.title}
                    </h3>
                    
                    <div className="mt-auto mb-1">
                        <p className="text-sm text-[#333333] font-medium">{event.date}</p>
                    </div>

                    {/* Download Button - Bottom Right */}
                    <div 
                        onClick={(e) => {
                            e.preventDefault();
                            // Handle download logic here
                        }}
                        className="absolute bottom-5 right-5 w-12 h-12 bg-[#FFF5F5] border border-[#EA2A28] rounded-[14px] flex items-center justify-center hover:bg-[#FFE5E5] transition-colors cursor-pointer"
                    >
                        <Image 
                        src="/images/icons/download-icon.svg" 
                        alt="Download" 
                        width={48}
                        height={48}
                        className="object-contain"
                        />
                    </div>
                    </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>


        {/* Notices Section */}
        <section className="container mx-auto px-4 md:px-20.5 py-12 md:py-16">
          {/* Header & Filters */}
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <h2 className="font-baron text-2xl font-bold text-[#1B261D] uppercase tracking-wide">Notices</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Notice Type */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                <span className="text-sm font-onest text-[#343434]">Notice Type</span>
                <ChevronDown size={14} className="text-[#343434]" />
              </div>
              
              <div className="hidden sm:block w-[1px] h-6 bg-[#C6CAD1]"></div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                    <span className="text-sm font-onest text-[#343434]">From </span>
                    <Calendar size={14} className="text-[#343434]" />
                  </div>
                  <span className="text-[#111111]">-</span>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D6D9DE] rounded-lg cursor-pointer">
                    <span className="text-sm font-onest text-[#343434]">To</span>
                     <Calendar size={14} className="text-[#343434]" />
                  </div>
              </div>
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {notices.map((notice) => (
              <Link href={`/events-and-notice/${notice.id}`} key={notice.id} className="block h-full">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeIn}
                    className="bg-[#F5F2E9] border border-[#2D4A2D] rounded-[24px] overflow-hidden flex flex-col relative group h-full hover:shadow-lg transition-shadow"
                >
                    {/* Image Section */}
                    <div className="relative h-[200px] w-full">
                        <Image
                            src={notice.image}
                            alt={notice.title}
                            fill
                            className="object-cover"
                        />
                        {/* Download Button - Bottom Right */}
                        <div 
                            onClick={(e) => {
                                e.preventDefault();
                                // Handle download logic here
                            }}
                            className="absolute top-2 right-2 w-12 h-12 bg-[#FFF5F5] border border-[#EA2A28] rounded-[14px] flex items-center justify-center hover:bg-[#FFE5E5] transition-colors cursor-pointer"
                        >
                            <Image 
                            src="/images/icons/download-icon.svg" 
                            alt="Download" 
                            width={48}
                            height={48}
                            className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 pt-6 flex flex-col flex-grow relative">
                    <span className="text-sm text-[#333333] mb-2">{notice.tag}</span>
                    <h3 className="font-montserrat font-bold text-xl text-[#2D4A2D] leading-tight mb-4 pr-12">
                        {notice.title}
                    </h3>
                    
                    <div className="mt-auto mb-1">
                        <p className="text-sm text-[#333333] font-medium">{notice.date}</p>
                    </div>
                    </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}