"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
// If you haven't installed 'motion' v12, change this import to "framer-motion"
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

// --- ANIMATION VARIANTS (Typed explicitly) ---

// 1. Initial Load Stagger (Left Side)
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
      delayChildren: 0.5,
    },
  },
};

// 2. Initial Load Item Reveal (Left Side Items)
const itemRevealVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { ease: "easeInOut" } 
  },
};

// 3. Tab Change Text Transition (Only for Text)
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

// 4. Right Column Initial Entry (Slide from Right - Happens once)
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

  useEffect(() => {
    const activeTab = tabRefs.current[activeTrek];
    if (activeTab) {
      // Calculate position relative to the parent container if possible, 
      // or just use offsetLeft if the layout is stable.
      const newX = activeTab.offsetLeft + 10;
      animate(highlightX, newX, {
        type: "spring",
        stiffness: 200,
        damping: 30,
      });
    }
  }, [activeTrek, highlightX]);

  const backgroundGradient = useMotionTemplate`
    linear-gradient(
      90deg, 
      transparent, 
      transparent calc(${highlightX}px - 200px), 
      #d4af37 ${highlightX}px, 
      rgba(110, 91, 29, 0.1) calc(${highlightX}px + 200px), 
      transparent
    )
  `;

  return (
    <section className="relative w-full min-h-[900px] bg-[#17261e] overflow-hidden">
      {/* --- Background Assets --- */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.54]">
        <Image src="/images/adventures-bg.png" alt="" fill className="object-cover" />
      </div>
      <div className="absolute top-0 left-0 w-full h-[212px] bg-gradient-to-b from-[#132019] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[212px] bg-gradient-to-t from-[#132019] to-transparent" />
      <div className="absolute top-0 left-0 h-full w-[356px] bg-gradient-to-r from-[#132019] to-transparent" />
      <div className="absolute top-0 right-0 h-full w-[193px] bg-gradient-to-l from-[#132019] to-transparent" />

      {/* --- Content --- */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[112px] py-[80px]">
        {/* Title */}
        <div className="flex flex-col items-center gap-[26px] text-center mb-[60px]">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal">Adventures</p>
          <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
            Eco tourism & adventures
          </h2>
        </div>

        {/* Grid Container */}
        <div className="flex justify-between items-start gap-[60px]">
          
          {/* --- LEFT SIDE (Text & Navigation) --- */}
          <motion.div 
            className="flex flex-col gap-[24px] max-w-[652px]"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            
            {/* DYNAMIC TEXT AREA (Animates on tab change) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrek.id} 
                variants={textTabChangeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-[24px]"
              >
                <div className="flex flex-col gap-[20px]">
                  <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-[20px] text-[#f5f2e9] capitalize">{currentTrek.subtitle}</motion.p>
                  <motion.p variants={itemRevealVariants} className="font-baron text-[32px] text-[#d4af37]">{currentTrek.name}</motion.p>
                </div>
                <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]">{currentTrek.description}</motion.p>
                <motion.p variants={itemRevealVariants} className="font-montserrat font-medium text-[20px] text-[#d4af37] capitalize">Official Guides- {currentTrek.guide}</motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Tabs (Static relative to tab changes, animates once on load) */}
            <motion.div variants={itemRevealVariants} className="relative mt-[20px]">
              <motion.div
                className="absolute top-[42px] left-0 w-full h-[3px]"
                style={{ background: backgroundGradient }}
              />

              <div className="flex gap-[72px] items-center relative">
                {treks.map((trek, index) => (
                  <button
                    key={trek.id}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    onClick={() => setActiveTrek(index)}
                    className={`flex flex-col gap-[16px] items-start p-0 bg-transparent border-none cursor-pointer transition-opacity ${
                      index !== activeTrek ? "opacity-[0.55]" : ""
                    }`}
                  >
                    <p className="font-montserrat font-medium text-[12px] text-[#f5f2e9] capitalize">
                      {trek.label}
                    </p>
                    <div className="w-[20px] h-[20px] relative">
                      <Image
                        src={index === activeTrek ? "/images/trek-dot-active.svg" : "/images/trek-dot.svg"}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="font-baron text-[16px] text-[#d4af37] text-center whitespace-nowrap">
                      {trek.name}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.button variants={itemRevealVariants} className="mt-[40px] px-[24px] py-[12px] rounded-[6px] w-fit bg-[#d4af37]/40 backdrop-blur-[2px]">
              <span className="font-poppins text-[16px] text-white underline">Look For Details</span>
            </motion.button>
          </motion.div>

          {/* --- RIGHT SIDE (Images) --- */}
          {/* Animates IN from right ONCE, but stays static on tab change */}
          <motion.div 
             className="relative w-[483px] h-[373px]"
             variants={rightColEntryVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
          >
             {/* No AnimatePresence, no Motion wrapper with Keys here. 
                 This ensures images update instantly without animation effects. */}
              <div className="absolute left-0 top-0 w-[300px] h-[373px] rounded-[13px] overflow-hidden shadow-xl">
                <Image src={currentTrek.images.main} alt={currentTrek.name} fill className="object-cover" priority />
              </div>
              <div className="absolute right-0 top-0 w-[167px] h-[144px] rounded-[13px] overflow-hidden shadow-lg">
                <Image src={currentTrek.images.small1} alt="" fill className="object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 w-[167px] h-[212px] rounded-[13px] overflow-hidden shadow-lg">
                <Image src={currentTrek.images.small2} alt="" fill className="object-cover" />
              </div>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-[100px] right-[112px] flex gap-[12px] items-center">
          <button
            className="w-[44px] h-[44px] opacity-40 hover:opacity-60 transition-opacity"
            onClick={() => setActiveTrek((prev) => (prev === 0 ? treks.length - 1 : prev - 1))}
          >
            <Image src="/images/nav-prev.svg" alt="Previous" width={44} height={44} className="rotate-180" />
          </button>
          <button
            className="w-[44px] h-[44px] hover:opacity-80 transition-opacity"
            onClick={() => setActiveTrek((prev) => (prev === treks.length - 1 ? 0 : prev + 1))}
          >
            <Image src="/images/nav-next.svg" alt="Next" width={44} height={44} />
          </button>
        </div>
      </div>
    </section>
  );
}