"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLeaders } from "@/hooks/useWebsiteContent";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  message: string;
  image: string;
}

export default function Testimonials() {
  const { data: leadersData, isLoading } = useLeaders({ limit: 10 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = useMemo(() => {
    return (leadersData?.leaders || [])
      .filter(l => l.status === "ACTIVE")
      .map(l => ({
        id: l.id,
        name: l.name,
        title: l.designation || "",
        message: l.message || "",
        image: l.image_url || "/images/testimonials/profile-placeholder.png",
      }));
  }, [leadersData]);

  const currentTestimonial = testimonials[currentIndex];

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-[400px] bg-[#132019] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative w-full min-h-screen bg-[#132019] overflow-hidden flex items-center py-16 md:py-24"
    >
      <div
        className="absolute top-0 left-0 w-full h-48 md:h-64 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-40 md:h-52 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div className="absolute inset-0">
        <Image
          src="/images/sections/Leadership.png"
          fill
          alt="testimonials background"
          className="object-cover opacity-30"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-12 md:mb-16">
          <h3 className="text-[#d4af37] font-display text-xl md:text-2xl  tracking-tight text-center">
            Testimonials
          </h3>
          <h2 className="text-white font-sans font-medium text-3xl md:text-4xl lg:text-5xl  text-center leading-tight">
            Leadership messages
          </h2>
        </div>

        {/* Speaker Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16 max-w-7xl mx-auto w-full">
          {/* Image Column */}
          <div className="relative flex-shrink-0 w-full max-w-[260px] md:max-w-[340px] lg:max-w-[400px] aspect-square flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-2xl"
              >
                <Image
                  src={currentTestimonial.image}
                  fill
                  alt={currentTestimonial.name}
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-6 text-center lg:text-left flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#d4af37] font-display text-2xl md:text-3xl lg:text-4xl leading-tight">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-[#f5f2e9] font-sans font-bold text-lg md:text-xl uppercase tracking-wider">
                    {currentTestimonial.title}
                  </p>
                </div>

                <div className="min-h-[180px] md:min-h-[220px] flex items-start justify-center lg:justify-start">
                  <p className="text-[#f5f2e9] font-sans font-medium text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl">
                    {currentTestimonial.message}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4 relative z-30">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Previous testimonial"
            >
              <Image
                src="/images/nav-next.svg"
                width={44}
                height={44}
                alt="Previous"
                className="rotate-180"
              />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Next testimonial"
            >
              <Image
                src="/images/nav-next.svg"
                width={44}
                height={44}
                alt="Next"
              />
            </button>
          </div>
        )}
      </div>

      {/* Decorative Mountain silhouette */}
      <motion.div
        className="absolute bottom-0 left-0 w-full z-10 pointer-events-none hidden md:block"
        initial={{ y: 0, scale: 1 }}
        whileInView={{ y: -150, scale: 1.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.1 }}
      >
        <Image
          src="/images/testimonials/mountain-testimonials.png"
          width={1920}
          height={800}
          alt=""
          className="w-full h-auto object-bottom opacity-50"
        />
      </motion.div>
    </section>
  );
}
