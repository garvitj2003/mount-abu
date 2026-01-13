"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Destination data - 6 items
const destinations = [
  {
    id: 1,
    image: "/images/destinations/nakkiLake.jpg",
    title: "Nakki Lake",
    description: "A serene lake surrounded by hills, perfect for boating.",
  },
  {
    id: 2,
    image: "/images/destinations/sunsetPoint.jpg",
    title: "Sunset Point",
    description: "One of the highest peaks offering breathtaking views.",
  },
  {
    id: 3,
    image: "/images/destinations/dilwaraTemple.jpg",
    title: "Dilwara Temples",
    description: "Celebrated for their exquisite white marble carvings.",
  },
  {
    id: 4,
    image: "/images/destinations/mountAbuPeak.jpg",
    title: "Guru Shikhar",
    description: "The highest peak of the Aravalli Range.",
  },
  {
    id: 5,
    image: "/images/destinations/achalgarhFort.jpg",
    title: "Achalgarh Fort",
    description: "An ancient fort with historical significance.",
  },
  {
    id: 6,
    image: "/images/destinations/toadRock.jpg",
    title: "Toad Rock",
    description: "A unique rock formation resembling a toad.",
  },
];

export default function DestinationsSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + destinations.length) % destinations.length
    );
  };

  const getPosition = (index: number) => {
    const total = destinations.length;
    let offset = (index - activeIndex + total) % total;

    // Logic to center the offset around 0 for any array length
    // This converts [0, 1, 2, 3, 4, 5] into [0, 1, 2, 3, -2, -1] for length 6
    if (offset > total / 2) {
      offset -= total;
    }
    
    return offset;
  };

  return (
    <section className="relative w-full min-h-[900px] bg-[#132019] overflow-hidden flex flex-col items-center">
      {/* --- Background --- */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/destination-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div
        className="absolute top-0 left-0 w-full h-[484px]"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(108, 100, 73, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[212px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* --- Header Content --- */}
      <div className="relative z-10 flex flex-col items-center pt-[85px] mb-[60px]">
        <p className="font-baron text-[24px] text-[#d4af37] leading-normal tracking-wide mb-4">
          Destinations
        </p>
        <h2 className="text-[#f5f2e9] text-center capitalize">
          <span className="font-montserrat font-medium text-[40px] block md:inline mr-2 drop-shadow-lg">
            Top Destinations to visit
          </span>
          <span className="font-montserrat font-semibold text-[48px] drop-shadow-lg">
            Mount Abu
          </span>
        </h2>
      </div>

      {/* --- 3D Carousel Container --- */}
      <div
        className="relative w-full max-w-[1224px] h-[450px] flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {destinations.map((dest, index) => {
            const position = getPosition(index);
            const isCenter = position === 0;
            
            // Check if the card is within the visible 5-card range
            // (Center(0) + 2 Left + 2 Right)
            const isVisible = Math.abs(position) <= 2;

            let xOffset = 0;
            let zIndex = 0;
            let scale = 1;
            let rotateY = 0;
            let opacity = 1;
            let brightness = 1;

            if (position === 0) {
              // Center
              zIndex = 50;
              scale = 1.15;
              opacity = 1;
            } else if (position === -1 || position === 1) {
              // Immediate Neighbors
              xOffset = position * 260;
              zIndex = 30;
              scale = 0.9;
              rotateY = position === -1 ? 15 : -15;
              opacity = 0.8;
              brightness = 1;
            } else if (position === -2 || position === 2) {
              // Far Neighbors
              xOffset = position * 220;
              zIndex = 10;
              scale = 0.85;
              rotateY = position === -2 ? 25 : -25;
              opacity = 0.75;
              brightness = 1;
            } else {
              // HIDDEN (Any card beyond the 5 visible slots)
              // We keep it in the DOM but hide it so it can animate in/out smoothly
              xOffset = 0; // Tuck behind center
              zIndex = -10;
              scale = 0;
              opacity = 0;
            }

            return (
              <motion.div
                key={dest.id}
                initial={false}
                animate={{
                  x: xOffset,
                  scale: scale,
                  zIndex: zIndex,
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `brightness(${brightness})`,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.25, 1, 0.5, 0.9],
                }}
                className="absolute w-[331px] h-[408px] rounded-[13px]"
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: isVisible ? "auto" : "none", // Disable clicks on hidden cards
                }}
              >
                {/* Image Card Container */}
                <div
                  className={`relative w-full h-full rounded-[13px] overflow-hidden shadow-2xl transition-all duration-500 group ${
                    isCenter
                      ? "border-4 border-[#122018] hover:scale-102"
                      : ""
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 331px"
                  />

                  {/* Overlay for depth on non-center cards */}
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/30 z-10" />
                  )}

                  {/* --- HOVER EFFECT (Only for center card) --- */}
                  {isCenter && (
                    <div className="absolute inset-4 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out rotate-12 pointer-events-none z-20" />
                  )}
                </div>

                {/* Content - Only Visible for Center Card */}
                <AnimatePresence>
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        delay: 0.2,
                        duration: 0.4,
                      }}
                      className="absolute bottom-0 left-0 w-full p-6 text-center z-50"
                    >
                      <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-black via-black/70 to-transparent -z-10 rounded-b-[13px]" />

                      <h3 className="font-montserrat font-bold text-[24px] text-[#f5f2e9] mb-2 drop-shadow-md">
                        {dest.title}
                      </h3>
                      <p className="font-montserrat text-[14px] text-gray-200 leading-relaxed drop-shadow-sm">
                        {dest.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- Navigation Controls --- */}
      <div className="flex items-center gap-[20px] relative z-20 mt-[40px]">
        <button
          className="w-[44px] h-[44px] rounded-full opacity-40 hover:opacity-60 transition-opacity"
          aria-label="Previous slide"
          onClick={handlePrev}
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
          className="w-[44px] h-[44px] rounded-full hover:opacity-80 transition-opacity"
          aria-label="Next slide"
          onClick={handleNext}
        >
          <Image
            src="/images/nav-next.svg"
            alt="Next"
            width={44}
            height={44}
          />
        </button>
      </div>
    </section>
  );
}