"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const heroImages = [
  "/images/hero/1.png",
  "/images/hero/2.png",
  "/images/hero/3.png",
  "/images/hero/4.png",
];

const mobileHeroImages = [
  "/images/hero/mobile/1.png",
  "/images/hero/mobile/2.png",
  "/images/hero/mobile/3.png",
  "/images/hero/mobile/4.png",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex} // Changing the key triggers the animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth 1.5s fade
          className="absolute inset-0 w-full h-full"
        >
          {/* Desktop Images */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src={heroImages[currentIndex]}
              alt={`Hero Background ${currentIndex + 1}`}
              fill
              priority // Keep priority high so images don't flicker on load
              className="object-cover object-center"
            />
          </div>
          {/* Mobile Images */}
          <div className="block md:hidden absolute inset-0">
            <Image
              src={mobileHeroImages[currentIndex]}
              alt={`Hero Background Mobile ${currentIndex + 1}`}
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}