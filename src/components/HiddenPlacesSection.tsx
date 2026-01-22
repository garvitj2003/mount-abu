"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// ----------------------------------------------------------------------
// OPTION A: If you are using the new Motion v12
import { motion, AnimatePresence, Variants } from "motion/react"; 
import { unexploredGems } from "../data/data";

// OPTION B: If you are using the standard Framer Motion v11
// import { motion, AnimatePresence, Variants } from "framer-motion";
// ----------------------------------------------------------------------

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

export default function HiddenPlacesSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Use unexploredGems from data.js
  const hiddenPlaces = unexploredGems;

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
  const activeImage = hiddenPlaces[getIndex(activeIndex)].details.images.main;
  const nextImage = hiddenPlaces[getIndex(activeIndex + 1)].details.images.main;
  const nextNextImage = hiddenPlaces[getIndex(activeIndex + 2)].details.images.main;

  return (
    <section id="hidden-places" className="relative w-full py-4 min-h-screen bg-[#17261e] overflow-hidden flex flex-col justify-center">
      
      {/* --- UPDATED BACKGROUND IMAGE SECTION --- */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentPlace.id} // Unique key ensures animation triggers on change
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }} // Matches your original opacity-40 class
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }} // Slow, smooth crossfade
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentPlace.details.images.main}
              alt="background"
              fill
              className="object-cover object-center"
              priority // Preload current background
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* ---------------------------------------- */}

      {/* Gradients */}
      <div
        className="absolute top-0 left-0 w-full h-96 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-96 z-0"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-16 md:py-24 pb-32">
        
        {/* Title Section */}
        <div className="flex flex-col items-center gap-6 text-center mb-16 lg:mb-24">
          <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal uppercase tracking-wide">
            Hidden Places
          </p>
          <h2 className="font-montserrat font-medium text-3xl md:text-4xl text-white capitalize leading-tight">
            Unexplored Gems of Mount Abu
          </h2>
        </div>

        {/* Content Row: Text (Left) + Carousel (Right) */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-12 lg:gap-8">
          
          {/* --- LEFT SIDE: TEXT INFO --- */}
          <div className="flex flex-col gap-8 w-full max-w-xl order-2 lg:order-1">
            <div className="flex flex-col gap-6 min-h-[200px]">
              
              {/* Animate Name */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`name-${activeIndex}`}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-baron text-3xl md:text-4xl text-[#d4af37] leading-normal text-center lg:text-left"
                  >
                    {currentPlace.title}
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
                    className="font-montserrat font-medium text-base md:text-xl text-[#f5f2e9] leading-relaxed text-center lg:text-left"
                  >
                    {currentPlace.description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between w-full mt-4">
              <button
                onClick={() => router.push(`/destinations/${currentPlace.slug}`)}
                className="px-6 py-3 rounded-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: "rgba(212, 175, 55, 0.44)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                }}
              >
                <span className="font-poppins text-sm md:text-base text-white underline">
                  Look for Details
                </span>
              </button>

              {/* Navigation Arrows */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 opacity-40 hover:opacity-100 transition-opacity"
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
                  className="w-11 h-11 hover:opacity-80 transition-opacity"
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
          <div className="relative w-full max-w-[340px] md:max-w-2xl lg:max-w-[700px] h-[400px] md:h-[360px] order-1 lg:order-2 flex justify-center lg:block">
            <AnimatePresence initial={false} mode="popLayout">
              
              {/* Card 1: The Active "Hero" Card */}
              <motion.div
                key={`card-active-${activeIndex}`}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1, zIndex: 10 }}
                exit={{ opacity: 0, x: -50, scale: 0.95, zIndex: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute lg:left-0 top-0 w-64 h-80 md:w-[292px] md:h-[361px] rounded-2xl border-[6px] border-[#d4af37] overflow-hidden shadow-2xl z-20 left-1/2 -translate-x-1/2 lg:translate-x-0"
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
                animate={{ opacity: 1, x: 0, scale: 1, zIndex: 5 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                className="hidden lg:block absolute top-[63px] w-[228px] h-[298px] rounded-2xl overflow-hidden shadow-xl"
                style={{ left: '312px' }}
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
                animate={{ opacity: 1, x: 0, scale: 1, zIndex: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                className="hidden lg:block absolute top-[63px] w-[228px] h-[298px] rounded-2xl overflow-hidden shadow-xl"
                style={{ left: '560px' }}
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
      <div className="absolute -bottom-5 lg:-bottom-18 left-0 w-full overflow-hidden text-[#f5f2e9] ">
          <svg
              className="relative block w-[calc(100%+1.3px)]"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
          >
              <path
                  d="M1457.11 84.73C1477.74 71.6451 1408.25 65.1637 1373.63 59.4344C1364.95 57.9979 1368.97 58.4708 1364.32 55.3942C1361.51 53.535 1357.33 52.8516 1355.59 50.541C1352.55 46.5118 1353.6 43.5335 1344.26 41.5169C1329.87 38.4109 1346.77 33.8054 1341.16 30.2894C1332.78 25.0409 1331.88 19.0413 1308.22 19.4719C1280.81 19.9704 1294.45 13.6148 1280.92 20.464C1275.54 2.41186 1282.75 10.3151 1199.3 18.0364C1190.75 18.8279 1187.9 18.6794 1184.74 24.0961C1176.61 37.9783 1180.85 27.6956 1184.74 35.0886C1186.35 38.1543 1167.37 45.7694 1157.71 46.203C1156.55 46.2551 1155.09 46.7959 1154.57 47.2472C1146.77 53.941 1155.96 53.6146 1090.37 49.308C1086.56 46.4655 1079.46 45.0772 1071.4 44.444C1066.18 37.2183 1084.55 37.7325 1063 30.8204C1059.3 31.2215 1055.92 29.9394 1051.52 30.2982C1036.52 31.5184 1047.11 25.4421 1030.1 24.096C1020.63 23.3468 985.546 21.6674 979.858 24.9564C980.707 27.4528 982.759 30.2363 978.121 30.4054C972.46 30.6099 969.048 32.3158 964.585 32.9687C963.393 35.006 962.324 36.8259 961.223 38.7088C957.5 38.7137 954.052 38.1848 950.948 39.2899C934.819 45.0281 932.059 36.6145 925.041 48.2992C923.103 51.5242 909.843 51.3896 901.215 51.1811C884.425 50.7731 888.804 52.4633 861.998 52.1486C859.557 52.1201 850.295 49.3493 829.877 49.5902C790.381 50.0602 795.615 52.2047 796.698 56.7177C792.481 56.8032 784.654 56.7541 781.776 57.582C775.661 59.343 739.592 60.0587 737.629 59.1482C735.531 58.1758 732.502 58.1463 729.862 57.7206C718.639 55.9105 721.799 60.1492 711.755 59.9673C708.603 58.3941 702.688 55.0157 692.417 57.5033C686.781 58.869 674.789 57.9959 669.567 56.057C653.89 50.2343 641.711 50.0917 637.591 44.9661C634.963 41.6978 625.138 41.9014 615.319 33.5852C607.72 27.149 599.442 41.105 587.35 25.8039C585.066 22.9132 584.482 20.3479 577.67 20.6213C562.857 21.2191 573.173 57.3538 524.895 32.2882C516.296 27.8244 525.715 25.8589 516.075 24.5207C512.192 23.9819 508.834 24.8343 506.389 22.3183C502.382 18.1975 503.9 18.5348 496.858 18.993C492.851 16.9547 489.401 15.1603 485.838 13.3994C478.721 9.88235 378.522 9.84006 355.325 8.0673C329.138 6.06543 335.499 2.96334 324.388 4.39296C300.38 7.48228 306.875 -0.895842 288.787 0.0795249C183.154 5.77539 218.923 6.43119 174.826 26.4941C155.864 35.1229 144.67 -1.33826 140.048 27.086C139.023 33.3934 142.141 34.7336 135.219 35.1328C126.012 35.6657 126.072 39.636 118.97 36.9597C109.642 33.4446 103.419 25.1186 92.4536 24.622C50.3959 22.7136 70.5241 52.4082 43.2131 56.8603C29.0772 59.165 13.9454 58.2368 7.77303 65.0122C4.14123 69.0022 5.62365 73.7011 3.46403 77.8208C2.1637 80.2966 1.00837 82.5757 0 84.73H1457.11Z"
                  fill="currentColor"
              ></path>
          </svg>
      </div>
    </section>
  );
}