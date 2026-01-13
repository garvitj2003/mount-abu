"use client";

import Image from "next/image";
import { useState } from "react";
// ----------------------------------------------------------------------
// OPTION A: If you are using the new Motion v12
import { motion, AnimatePresence, Variants } from "motion/react"; 

// OPTION B: If you are using the standard Framer Motion v11
// import { motion, AnimatePresence, Variants } from "framer-motion";
// ----------------------------------------------------------------------

// Best Practice: Define variants OUTSIDE the component to prevent re-creation on every render
const textVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeInOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.3, 
      ease: "easeInOut" 
    } 
  },
};

const hiddenPlaces = [
  {
    id: 1,
    name: "Narki Lake",
    description:
      "Mount Abu is not only a crown jewel of Rajasthan's tourism but also a symbol of our state's commitment to sustainable development and civic excellence.",
    image: "/images/destinations/nakkiLake.jpg", 
  },
  {
    id: 2,
    name: "Dilwara Jain Temple",
    description:
      "The Dilwara Temples are a group of Jain temples located in Mount Abu. They are famous for their stunning marble architecture and intricate carvings.",
    image: "/images/destinations/dilwaraTemple.jpg",
  },
  {
    id: 3,
    name: "View Point",
    description:
      "One of the most scenic spots in Mount Abu offering panoramic views of the surrounding Aravalli hills and the lush green valleys below.",
    image: "/images/destinations/sunsetPoint.jpg",
  },
  {
    id: 4,
    name: "Toad Rock",
    description:
      "A unique rock formation that resembles a toad about to leap. This natural wonder offers excellent views and is a popular spot for photography.",
    image: "/images/destinations/toadRock.jpg",
  },
  {
    id: 5,
    name: "Guru Shikhar",
    description:
      "The highest point of the Aravalli Range, offering breathtaking panoramic views of the entire region.",
    image: "/images/destinations/mountAbuPeak.jpg",
  },
];

export default function HiddenPlacesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper to handle wrapping around the array safely
  const getIndex = (index: number) => {
    return (index + hiddenPlaces.length) % hiddenPlaces.length;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % hiddenPlaces.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? hiddenPlaces.length - 1 : prev - 1));
  };

  const currentPlace = hiddenPlaces[activeIndex];

  // We determine the 3 visible images: Active, Next, Next+1
  const activeImage = hiddenPlaces[getIndex(activeIndex)].image;
  const nextImage = hiddenPlaces[getIndex(activeIndex + 1)].image;
  const nextNextImage = hiddenPlaces[getIndex(activeIndex + 2)].image;

  return (
    <section className="relative w-full min-h-[925px] bg-[#17261e] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hidden-places-bg.png"
          alt="background"
          fill
          className="object-cover object-center opacity-40"
        />
      </div>

      {/* Gradients */}
      <div
        className="absolute top-0 left-0 w-full h-[400px]"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[473px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[70px] py-[80px]">
        
        {/* Title Section */}
        <div className="flex flex-col items-center gap-[26px] text-center mb-[80px] lg:mb-[120px]">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal uppercase tracking-wide">
            Hidden Places
          </p>
          <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
            Unexplored Gems of Mount Abu
          </h2>
        </div>

        {/* Content Row: Text (Left) + Carousel (Right) */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
          
          {/* --- LEFT SIDE: TEXT INFO --- */}
          <div className="flex flex-col gap-[32px] w-full max-w-[562px]">
            <div className="flex flex-col gap-[24px] min-h-[200px]">
              
              {/* Animate Name */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`name-${activeIndex}`}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-baron text-[32px] text-[#d4af37] leading-normal"
                  >
                    {currentPlace.name}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Animate Description */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${activeIndex}`}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]"
                  >
                    {currentPlace.description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between w-full mt-4">
              <button
                className="px-[24px] py-[12px] rounded-[6px] transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(212, 175, 55, 0.44)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                }}
              >
                <span className="font-poppins text-[16px] text-white underline">
                  View More
                </span>
              </button>

              {/* Navigation Arrows */}
              <div className="flex gap-[12px] items-center">
                <button
                  onClick={handlePrev}
                  className="w-[44px] h-[44px] opacity-40 hover:opacity-100 transition-opacity"
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
                  className="w-[44px] h-[44px] hover:opacity-80 transition-opacity"
                  aria-label="Next"
                >
                  <Image
                    src="/images/nav-next.svg"
                    alt="Next"
                    width={44}
                    height={44}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: ANIMATED IMAGE STACK --- */}
          <div className="relative w-full max-w-[709px] h-[361px]">
            <AnimatePresence initial={false} mode="popLayout">
              
              {/* Card 1: The Active "Hero" Card */}
              <motion.div
                key={`card-active-${activeIndex}`}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, zIndex: 10 }}
                exit={{ opacity: 0, x: -50, scale: 0.95, zIndex: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute left-0 top-0 w-[292px] h-[361px] rounded-[17px] border-[6px] border-[#d4af37] overflow-hidden shadow-2xl"
              >
                <Image
                  src={activeImage}
                  alt="Active Place"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Card 2: The First Preview (Middle) */}
              <motion.div
                key={`card-next-${activeIndex}`}
                initial={{ opacity: 0, x: 100 }} 
                animate={{ opacity: 1, x: 312, scale: 1, zIndex: 5 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                className="absolute top-[63px] w-[228px] h-[298px] rounded-[17px] overflow-hidden shadow-xl"
              >
                <Image
                  src={nextImage}
                  alt="Next Place"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>

              {/* Card 3: The Second Preview (Far Right) */}
              <motion.div
                key={`card-next-next-${activeIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 560, scale: 1, zIndex: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[63px] w-[228px] h-[298px] rounded-[17px] overflow-hidden shadow-xl"
              >
                <Image
                  src={nextNextImage}
                  alt="Far Next Place"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>
              
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full h-[85px] z-20 pointer-events-none">
        <Image
          src="/images/wave-top.svg"
          alt="wave"
          fill
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}