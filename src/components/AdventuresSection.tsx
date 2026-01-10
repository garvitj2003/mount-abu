"use client";

import Image from "next/image";
import { useState } from "react";

// Trek data
const treks = [
  {
    id: 1,
    label: "Trek 1",
    name: "Shanti shikhar",
    subtitle: "Limdi Kothi to",
    description:
      "This is a calm and refreshing trek through forested paths of the Aravalli hills. The route is shaded and rich in natural vegetation, making it pleasant even during warmer months. Shanti Shikhar offers quiet surroundings and scenic views, ideal for relaxation and nature appreciation. The trek is easy to moderate and suitable for beginners.",
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
    description:
      "Explore the mystical Aadesh Cave through a scenic forest trail. This moderate trek takes you through dense vegetation and rocky terrain, offering glimpses of local wildlife and beautiful vistas along the way.",
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
    description:
      "Craig's Point offers breathtaking panoramic views of the surrounding valleys. The trek passes through pine forests and rocky outcrops, making it a favorite among photography enthusiasts and nature lovers.",
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
    description:
      "Table Rock is a unique geological formation accessible through a moderately challenging trail. The flat rock surface at the summit provides stunning views and a perfect spot for rest and reflection.",
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

  return (
    <section className="relative w-full min-h-[900px] bg-[#17261e] overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.54]">
        <Image
          src="/images/adventures-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[212px]"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[212px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Left gradient */}
      <div
        className="absolute top-0 left-0 h-full w-[356px]"
        style={{
          background:
            "linear-gradient(to right, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Right gradient */}
      <div
        className="absolute top-0 right-0 h-full w-[193px]"
        style={{
          background:
            "linear-gradient(to left, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[112px] py-[80px]">
        {/* Title Section */}
        <div className="flex flex-col items-center gap-[26px] text-center mb-[60px]">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal">
            Adventures
          </p>
          <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
            Eco tourism & adventures
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="flex justify-between items-start gap-[60px]">
          {/* Left Content */}
          <div className="flex flex-col gap-[24px] max-w-[652px]">
            {/* Trek Info */}
            <div className="flex flex-col gap-[20px]">
              <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] capitalize">
                {currentTrek.subtitle}
              </p>
              <p className="font-baron text-[32px] text-[#d4af37]">
                {currentTrek.name}
              </p>
            </div>

            {/* Description */}
            <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]">
              {currentTrek.description}
            </p>

            {/* Guide */}
            <p className="font-montserrat font-medium text-[20px] text-[#d4af37] capitalize">
              Official Guides- {currentTrek.guide}
            </p>

            {/* Trek Navigation */}
            <div className="relative mt-[20px]">
              {/* Gold line */}
              <div
                className="absolute top-[33px] left-0 w-[764px] h-[3px]"
                style={{
                  background:
                    "linear-gradient(to right, rgba(161, 133, 42, 0) 0%, #d4af37 21.6%, rgba(110, 91, 29, 0.1) 54.4%)",
                }}
              />

              {/* Trek tabs */}
              <div className="flex gap-[72px] items-center">
                {treks.map((trek, index) => (
                  <button
                    key={trek.id}
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
                        src={
                          index === activeTrek
                            ? "/images/trek-dot-active.svg"
                            : "/images/trek-dot.svg"
                        }
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

            {/* Look For Details Button */}
            <button
              className="mt-[40px] px-[24px] py-[12px] rounded-[6px] w-fit"
              style={{
                background: "rgba(212, 175, 55, 0.44)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              <span className="font-poppins text-[16px] text-white underline">
                Look For Details
              </span>
            </button>
          </div>

          {/* Right Content - Images */}
          <div className="relative w-[483px] h-[373px]">
            {/* Main large image */}
            <div className="absolute left-0 top-0 w-[300px] h-[373px] rounded-[13px] overflow-hidden">
              <Image
                src={currentTrek.images.main}
                alt={currentTrek.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Small image 1 */}
            <div className="absolute right-0 top-0 w-[167px] h-[144px] rounded-[13px] overflow-hidden">
              <Image
                src={currentTrek.images.small1}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* Small image 2 */}
            <div className="absolute right-0 bottom-0 w-[167px] h-[212px] rounded-[13px] overflow-hidden">
              <Image
                src={currentTrek.images.small2}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-[100px] right-[112px] flex gap-[12px] items-center">
          {/* Previous button */}
          <button
            className="w-[44px] h-[44px] opacity-40 hover:opacity-60 transition-opacity"
            aria-label="Previous"
            onClick={() =>
              setActiveTrek((prev) => (prev === 0 ? treks.length - 1 : prev - 1))
            }
          >
            <Image
              src="/images/nav-prev.svg"
              alt="Previous"
              width={44}
              height={44}
              className="rotate-180"
            />
          </button>

          {/* Next button */}
          <button
            className="w-[44px] h-[44px] hover:opacity-80 transition-opacity"
            aria-label="Next"
            onClick={() =>
              setActiveTrek((prev) => (prev === treks.length - 1 ? 0 : prev + 1))
            }
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
    </section>
  );
}
