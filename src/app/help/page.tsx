"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import { motion, Variants } from "motion/react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="light" />

      <main className="flex-grow w-full relative">
        {/* Hero Section */}
        <section className="relative w-full h-screen min-h-[600px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/sections/Tenders.png"
              alt="Help and Support Background"
              fill
              className="object-bottom"
              priority
            />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-20.5 h-full flex flex-col justify-center">
             
             <div className="flex flex-col gap-12 mt-10 md:mt-0">
                {/* Header with Back Button */}
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
                      width="32"
                      height="26"
                      viewBox="0 0 28 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block"
                    >
                      <path
                        d="M1.07129 11.1126L26.0713 11.1126"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.1543 21.153L1.07096 11.113L11.1543 1.07129"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <h1 className="font-baron  text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight shadow-sm">
                    Help and support
                  </h1>
                </motion.div>

                {/* Contact Card */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.2 }}
                  className="bg-[#FFFBEF] rounded-[10px] overflow-hidden max-w-xl shadow-2xl flex"
                >
                  {/* Green Accent Bar */}
                  <div className="w-3 bg-[#179362] shrink-0" />
                  
                  <div className="p-4 md:p-6">
                    <p className="font-montserrat text-[#1B261D] text-lg mb-3 leading-relaxed">
                        For any technical issue or support please contact the developer at below point:
                    </p>
                    
                    <div className="flex flex-col gap-2">
                        <h3 className="font-montserrat font-bold text-xl md:text-2xl text-[#1B261D]">
                        Vysion Technology
                        </h3>
                        <p className="font-montserrat font-bold text-lg md:text-xl text-[#1B261D]">
                        Www.Techvysion.Com
                        </p>
                        <p className="font-montserrat font-bold text-lg md:text-xl text-[#1B261D]">
                        Nikhilvyas@Techvysion.Com
                        </p>
                        <p className="font-montserrat font-bold text-lg md:text-xl text-[#1B261D]">
                        +91 8078693503
                        </p>
                    </div>
                  </div>
                </motion.div>
             </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1">
             <Image
                src="/images/wave-bottom.svg"
                alt=""
                width={1920}
                height={100}
                className="w-full h-auto object-cover"
             />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
