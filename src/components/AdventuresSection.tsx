"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate, animate } from "motion/react";

// Trek data (kept the same)
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

export default function AdventuresSection() {
  const [activeTrek, setActiveTrek] = useState(0);
  const currentTrek = treks[activeTrek];

  // 1. Create a MotionValue to store the pixel position of the "Highlight"
  const highlightX = useMotionValue(0);

  // 2. Create refs to track the button positions
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 3. Update the highlight position whenever activeTrek changes
  useEffect(() => {
    const activeTab = tabRefs.current[activeTrek];
    if (activeTab) {
      // Find the center of the active tab's DOT relative to the button
      // The dot is roughly at the vertical center, and left aligned in the flex col.
      // But visually in your design, the dot is the anchor.
      // Let's calculate the center of the BUTTON element for simplicity, 
      // or specifically target the dot if we needed extreme precision.
      // Here, offsetLeft gets us the start of the button. + 10px centers it on the dot (width 20px).
      const newX = activeTab.offsetLeft + 10; 
      
      // Animate the value smoothly
      animate(highlightX, newX, {
        type: "spring",
        stiffness: 200,
        damping: 30,
      });
    }
  }, [activeTrek]);

  // 4. Construct the dynamic gradient string
  // We use `calc` to create a gradient that fades out 150px to the left and right of the center point.
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
      {/* --- Background Assets (Image & Gradients) --- */}
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

        {/* Grid */}
        <div className="flex justify-between items-start gap-[60px]">
          {/* Left Side */}
          <div className="flex flex-col gap-[24px] max-w-[652px]">
            <div className="flex flex-col gap-[20px]">
              <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] capitalize">{currentTrek.subtitle}</p>
              <p className="font-baron text-[32px] text-[#d4af37]">{currentTrek.name}</p>
            </div>
            <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]">{currentTrek.description}</p>
            <p className="font-montserrat font-medium text-[20px] text-[#d4af37] capitalize">Official Guides- {currentTrek.guide}</p>

            {/* Trek Navigation Area */}
            <div className="relative mt-[20px]">
              
              {/* THE STATIC LINE WITH MOVING COLORS 
                  - It spans the full width of this container.
                  - It sits behind the buttons (absolute).
                  - The background gradient moves via the `style` prop.
              */}
              <motion.div
                className="absolute top-[42px] left-0 w-full h-[3px]"
                style={{
                  background: backgroundGradient,
                }}
              />

              {/* Tabs */}
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
            </div>

            <button className="mt-[40px] px-[24px] py-[12px] rounded-[6px] w-fit bg-[#d4af37]/40 backdrop-blur-[2px]">
              <span className="font-poppins text-[16px] text-white underline">Look For Details</span>
            </button>
          </div>

          {/* Right Side (Images) - Preserved */}
          <div className="relative w-[483px] h-[373px]">
            <div className="absolute left-0 top-0 w-[300px] h-[373px] rounded-[13px] overflow-hidden">
              <Image src={currentTrek.images.main} alt={currentTrek.name} fill className="object-cover" />
            </div>
            <div className="absolute right-0 top-0 w-[167px] h-[144px] rounded-[13px] overflow-hidden">
              <Image src={currentTrek.images.small1} alt="" fill className="object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 w-[167px] h-[212px] rounded-[13px] overflow-hidden">
              <Image src={currentTrek.images.small2} alt="" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Preserved */}
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