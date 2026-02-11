"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  message: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Shri Bhajan Lal Sharma",
    title: "Chief Minister, Rajasthan",
    message:
      "Mount Abu is not only a crown jewel of Rajasthan’s tourism but also a symbol of our state’s commitment to sustainable development and civic excellence. As Chief Minister, I am proud of the efforts being made by the Mount Abu Nagar Palika to preserve its natural beauty and enhance the quality of life for its residents and visitors. I encourage every citizen and tourist to experience the unique blend of spirituality, history, and nature that Mount Abu offers, and I assure continued support from the state government for its growth and prosperity.",
    image: "/images/testimonials/Shri Bhajan Lal Sharma.png",
  },
  {
    id: 2,
    name: "Shri Jhabar Singh Kharra",
    title: "Minister of State for Urban Development & Self-Governance",
    message:
      "Mount Abu’s legacy as a hill station is built on its scenic beauty, cultural richness, and vibrant community. As the Minister for Urban Development & Self-Governance, I am committed to supporting initiatives that enhance the town’s cleanliness, safety, and civic amenities. Our focus is on sustainable urban planning and citizen engagement, ensuring that Mount Abu remains a model hill station for Rajasthan. I welcome every visitor to experience the magic of Mount Abu and be a part of our journey towards a cleaner, greener, and more inclusive future.",
    image: "/images/testimonials/Shri Jhabar Singh Kharra.png",
  },
  {
    id: 3,
    name: "Alpa Chaudhary (IAS)",
    title: "District Collector, Sirohi",
    message:
      "Mount Abu is not just a hill station; it is a symbol of Rajasthan’s rich cultural heritage and natural beauty. As District Collector, Sirohi, I am committed to ensuring that Mount Abu continues to thrive as a premier tourist destination while maintaining its ecological balance and civic amenities. I encourage every visitor to experience the unique blend of spirituality, history, and nature that Mount Abu offers, and I assure all residents and tourists of our continued efforts in making Mount Abu cleaner, safer, and more welcoming for everyone.",
    image: "/images/testimonials/Alpa Chaudhary (IAS).png",
  },
  {
    id: 4,
    name: "Anshu Priya (IAS)",
    title: "SDM, Mount Abu",
    message:
      "Mount Abu’s charm lies in its serene lakes, ancient temples, and the warmth of its people. As SDM, Mount Abu, I am proud to lead initiatives that enhance the town’s cleanliness, safety, and civic services. My team and I are dedicated to making Mount Abu a model hill station, where every visitor feels at home. I invite you to explore Mount Abu’s beauty and contribute to its sustainable development by respecting its environment and heritage.",
    image: "/images/testimonials/Anshu Priya (IAS).png",
  },
  {
    id: 5,
    name: "Shri Asutosh Acharya",
    title: "Executive Officer, Municipal Body, Mount Abu",
    message:
      "Mount Abu’s legacy as a hill station is built on its scenic beauty, cultural richness, and vibrant community. As Executive Officer, I am committed to providing efficient municipal services and enhancing the quality of life for our residents and visitors. Our focus is on sustainable development, citizen engagement, and preserving Mount Abu’s unique identity. I welcome you to experience the magic of Mount Abu and be a part of our journey towards a cleaner, greener, and more inclusive future.",
    image: "/images/testimonials/Shri Asutosh Acharya.png",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };

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
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 max-w-7xl mx-auto w-full">
          {/* Image Column */}
          <div className="relative flex-shrink-0 w-full max-w-[320px] md:max-w-[420px] aspect-[3/4] flex justify-center items-center -mt-12 md:-mt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full overflow-hidden"
              >
                <Image
                  src={currentTestimonial.image}
                  fill
                  alt={currentTestimonial.name}
                  className="object-contain object-center"
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
