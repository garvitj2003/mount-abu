"use client"
import React from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import DestinationMapSection from "@/components/landing/DestinationMapSection";
import { motion } from "motion/react";
import { allItems } from "@/data/events";
import { Heart, Clock, Share2, ArrowLeft } from "lucide-react"; 
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function EventNoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  
  const { id } = React.use(params); 

  const item = allItems.find((d) => d.id.toString() === id);

  if (!item) {
    notFound();
  }

  // Filter other items for "Other Festivals/Notices" section
  const otherItems = allItems.filter(i => i.type === item.type && i.id !== item.id);

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="light" />

      <main className="flex-grow w-full pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-20.5">
            
            {/* Header Section */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex flex-col gap-8 mb-8"
            >
                {/* Top Bar with Back Button and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/events-and-notice")} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ArrowLeft size={28} className="text-[#2D4A2D]" />
                        </button>
                        <h1 className="font-baron text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D4A2D] tracking-wide leading-tight">
                            {item.title}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <button className="w-10 h-10 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white hover:bg-[#1f331f] transition-colors">
                            <Heart size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white hover:bg-[#1f331f] transition-colors">
                            <Clock size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#2D4A2D] hover:bg-gray-50 transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-3">
                    <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                        {item.tag}
                    </span>
                    <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                        {item.date}
                    </span>
                    {item.time && (
                        <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                            {item.time}
                        </span>
                    )}
                    <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                        {item.status || "Active"}
                    </span>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
                {/* Left: Image */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="w-full lg:w-1/2"
                >
                    <div className="relative aspect-square w-full rounded-[24px] overflow-hidden shadow-lg border border-[#D4AF37]/30">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                {/* Right: Description */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="w-full lg:w-1/2 flex flex-col justify-start"
                >
                    <h2 className="font-baron text-2xl font-bold text-[#2D4A2D] mb-6 uppercase">
                        {item.type === 'event' ? 'Event Description' : 'Notice Details'}
                    </h2>
                    <p className="font-montserrat text-[#343434] leading-relaxed text-base md:text-lg text-justify">
                        {item.description || "No description available."}
                    </p>
                </motion.div>
            </div>

            {/* Where Section */}
            {item.location && (
                <div className="mb-16">
                    <DestinationMapSection />
                </div>
            )}

            {/* Other Items Section */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="mb-8"
            >
                <h2 className="font-baron text-2xl font-bold text-[#2D4A2D] mb-8 uppercase">
                    {item.type === 'event' ? 'Other Festivals' : 'Other Notices'}
                </h2>
                <div className="flex flex-wrap gap-6">
                    {otherItems.map((other) => (
                        <Link href={`/events-and-notice/${other.id}`} key={other.id} className="w-[338px] shrink-0">
                            <div className="group cursor-pointer">
                                <div className="relative h-[250px] w-full rounded-[20px] overflow-hidden mb-4 border border-[#2D4A2D]/20">
                                    <Image
                                        src={other.image}
                                        alt={other.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-montserrat font-bold text-xl text-[#1C1C1C] group-hover:text-[#2D4A2D] transition-colors mb-1">
                                    {other.title}
                                </h3>
                                <p className="font-montserrat text-[#179362] text-sm">
                                    {other.date}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
