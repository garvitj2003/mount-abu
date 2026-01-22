"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  animate, 
  AnimatePresence, 
  Variants 
} from "motion/react";

// Trek data
const treks = [
  {
    id: 1,
    label: "Trek 1",
    name: "Shanti shikhar",
    subtitle: "Limdi Kothi to",
    description: "This is a calm and refreshing trek through forested paths of the Aravalli hills...",
    guide: "Rabisankar Mishra",
    images: {
      main: "/images/adventure-main.png",
      small1: "/images/adventure-small-1.png",
      small2: "/images/adventure-small-2.png",
    },
  },
  {
    id: 2,
    label: "Trek 2",
    name: "Aadesh cave",
    subtitle: "Forest Path to",
    description: "Explore the mystical Aadesh Cave through a scenic forest trail...",
    guide: "Rabisankar Mishra",
    images: {
      main: "/images/adventure-main.png",
      small1: "/images/adventure-small-1.png",
      small2: "/images/adventure-small-2.png",
    },
  },
  {
    id: 3,
    label: "Trek 3",
    name: "Craigs point",
    subtitle: "Valley Trail to",
    description: "Craig's Point offers breathtaking panoramic views...",
    guide: "Rabisankar Mishra",
    images: {
      main: "/images/adventure-main.png",
      small1: "/images/adventure-small-1.png",
      small2: "/images/adventure-small-2.png",
    },
  },
  {
    id: 4,
    label: "Trek 4",
    name: "Table Rock",
    subtitle: "Mountain Path to",
    description: "Table Rock is a unique geological formation accessible...",
    guide: "Rabisankar Mishra",
    images: {
      main: "/images/adventure-main.png",
      small1: "/images/adventure-small-1.png",
      small2: "/images/adventure-small-2.png",
    },
  },
];

// --- ANIMATION VARIANTS ---
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.8, delayChildren: 0.5 },
  },
};

const itemRevealVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { ease: "easeInOut" } 
  },
};

const textTabChangeVariants: Variants = {
  initial: { opacity: 0, y: 25, filter: "blur(8px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    filter: "blur(8px)", 
    transition: { duration: 0.3, ease: "easeIn" } 
  },
};

const rightColEntryVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 }
  }
};

export default function AdventuresSection() {
  const [activeTrek, setActiveTrek] = useState(0);
  const currentTrek = treks[activeTrek];

  // --- LINE ANIMATION LOGIC ---
  const highlightX = useMotionValue(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTab = tabRefs.current[activeTrek];
    if (activeTab && scrollContainerRef.current) {
      // 1. Animate the Gold Line
      const newX = activeTab.offsetLeft + 10;
      animate(highlightX, newX, {
        type: "spring",
        stiffness: 200,
        damping: 30,
      });

      // 2. Scroll the container to keep the active tab visible
      // We calculate the center position to avoid scrolling the whole page
      const container = scrollContainerRef.current;
      const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeTrek, highlightX]);

  const backgroundGradient = useMotionTemplate`
    linear-gradient(
      90deg, 
      transparent, 
      transparent calc(${highlightX}px - 100px), 
      #d4af37 ${highlightX}px, 
      rgba(110, 91, 29, 0.1) calc(${highlightX}px + 100px), 
      transparent
    )
  `;

  return (
    <section id="adventures" className="relative w-full min-h-screen bg-[#17261e] overflow-hidden">
      {/* --- Background Assets --- */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.54]">
        <Image src="/images/adventures-bg.png" alt="" fill className="object-cover" />
      </div>
      <div className="absolute top-0 left-0 w-full h-52 bg-gradient-to-b from-[#132019] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-[#132019] to-transparent" />
      <div className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-[#132019] to-transparent hidden md:block" />
      <div className="absolute top-0 right-0 h-full w-1/5 bg-gradient-to-l from-[#132019] to-transparent hidden md:block" />

      {/* --- Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 pb-32 md:pb-40">
        {/* Title */}
        <div className="flex flex-col items-center gap-6 text-center mb-12 md:mb-16">
          <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal tracking-wider">Adventures</p>
          <h2 className="font-montserrat font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight">
            Eco tourism & adventures
          </h2>
        </div>

        {/* Grid Container */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-16">
          
          {/* --- LEFT SIDE (Text & Navigation) --- */}
          <motion.div 
            className="flex flex-col gap-6 w-full md:max-w-2xl order-2 md:order-1"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            
            {/* DYNAMIC TEXT AREA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrek.id} 
                variants={textTabChangeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6 min-h-[180px] md:min-h-[220px]" 
              >
                <div className="flex flex-col gap-4">
                  <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-lg md:text-xl text-[#f5f2e9] capitalize">{currentTrek.subtitle}</motion.p>
                  <motion.p variants={itemRevealVariants} className="font-baron text-2xl md:text-3xl text-[#d4af37]">{currentTrek.name}</motion.p>
                </div>
                <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-base md:text-lg text-[#f5f2e9] leading-relaxed">{currentTrek.description}</motion.p>
                <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-base md:text-lg text-[#d4af37] capitalize">Official Guides- {currentTrek.guide}</motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Tabs */}
            <motion.div 
              variants={itemRevealVariants} 
              className="relative mt-12 overflow-x-auto pb-6 md:pb-2 scrollbar-hide"
              ref={scrollContainerRef}
              style={{
                scrollbarWidth: 'none',  /* Firefox */
                msOverflowStyle: 'none',  /* IE and Edge */
              }}
            >
              <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
              `}</style>

              {/* Animated Gold Line */}
              <motion.div
                className="absolute top-10 left-0 h-[3px] min-w-full"
                style={{ 
                  background: backgroundGradient,
                  width: "100%" 
                }}
              />

              <div className="flex gap-12 md:gap-24 items-center relative min-w-max">
                {treks.map((trek, index) => (
                  <button
                    key={trek.id}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    onClick={() => setActiveTrek(index)}
                    className={`flex flex-col gap-4 items-start p-0 bg-transparent border-none cursor-pointer transition-all duration-300 ${
                      index !== activeTrek ? "opacity-40 hover:opacity-70" : "opacity-100"
                    }`}
                  >
                    <p className="font-montserrat font-medium text-[10px] md:text-xs text-[#f5f2e9] capitalize tracking-wider">
                      {trek.label}
                    </p>
                    <div className="w-5 h-5 relative">
                      <Image
                        src={index === activeTrek ? "/images/trek-dot-active.svg" : "/images/trek-dot.svg"}
                        alt=""
                        width={20}
                        height={20}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="font-baron text-base md:text-lg text-[#d4af37] text-center whitespace-nowrap">
                      {trek.name}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* --- RIGHT SIDE (Images) --- */}
          <motion.div 
             className="relative w-full max-w-[480px] aspect-[4/3] md:h-[373px] order-1 md:order-2"
             variants={rightColEntryVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
          >
              <div className="absolute left-0 top-0 w-[60%] md:w-[300px] h-full rounded-xl overflow-hidden shadow-xl">
                <Image src={currentTrek.images.main} alt={currentTrek.name} fill className="object-cover" priority />
              </div>
              <div className="absolute right-0 top-0 w-[35%] md:w-[167px] h-[38%] rounded-xl overflow-hidden shadow-lg">
                <Image src={currentTrek.images.small1} alt="" fill className="object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 w-[35%] md:w-[167px] h-[55%] rounded-xl overflow-hidden shadow-lg">
                <Image src={currentTrek.images.small2} alt="" fill className="object-cover" />
              </div>
          </motion.div>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-12 md:bottom-24 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between pointer-events-none">
          {/* Details Button */}
          <motion.button 
            className="px-6 py-3 rounded-lg bg-[#d4af37]/40 backdrop-blur-sm pointer-events-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemRevealVariants}
          >
            <span className="font-poppins text-sm md:text-base text-white underline">Look For Details</span>
          </motion.button>

          {/* Navigation Arrows */}
          <div className="flex gap-3 items-center pointer-events-auto">
            <button
              className="w-11 h-11 opacity-40 hover:opacity-60 transition-opacity"
              onClick={() => setActiveTrek((prev) => (prev === 0 ? treks.length - 1 : prev - 1))}
            >
              <Image src="/images/nav-prev.svg" alt="Previous" width={44} height={44} className="rotate-180" />
            </button>
            <button
              className="w-11 h-11 hover:opacity-80 transition-opacity"
              onClick={() => setActiveTrek((prev) => (prev === treks.length - 1 ? 0 : prev + 1))}
            >
              <Image src="/images/nav-next.svg" alt="Next" width={44} height={44} />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}