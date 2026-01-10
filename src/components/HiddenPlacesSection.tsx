"use client";

import Image from "next/image";
import { useState } from "react";

// Hidden places data
const hiddenPlaces = [
  {
    id: 1,
    name: "Narki Lake",
    description:
      "Mount Abu is not only a crown jewel of Rajasthan's tourism but also a symbol of our state's commitment to sustainable development and civic excellence. As Chief Minister, I am proud of the efforts being made by the Mount Abu",
    image: "/images/hidden-card-1.png",
  },
  {
    id: 2,
    name: "Dilwara Jain Temple",
    description:
      "The Dilwara Temples are a group of Jain temples located in Mount Abu. They are famous for their stunning marble architecture and intricate carvings that date back to the 11th-13th centuries.",
    image: "/images/hidden-card-2.png",
  },
  {
    id: 3,
    name: "View Point",
    description:
      "One of the most scenic spots in Mount Abu offering panoramic views of the surrounding Aravalli hills and the lush green valleys below.",
    image: "/images/hidden-card-3.png",
  },
  {
    id: 4,
    name: "Toad Rock",
    description:
      "A unique rock formation that resembles a toad about to leap. This natural wonder offers excellent views and is a popular spot for photography.",
    image: "/images/hidden-card-4.png",
  },
];

// Card images for carousel
const cardImages = [
  "/images/hidden-card-1.png",
  "/images/hidden-card-2.png",
  "/images/hidden-card-3.png",
  "/images/hidden-card-4.png",
  "/images/hidden-card-5.png",
];

export default function HiddenPlacesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentPlace = hiddenPlaces[activeIndex];

  return (
    <section className="relative w-full min-h-[925px] bg-[#17261e] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hidden-places-bg.png"
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[400px]"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[473px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Second bottom gradient for deeper effect */}
      <div
        className="absolute bottom-0 left-0 w-full h-[396px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-[70px] py-[80px]">
        {/* Title Section */}
        <div className="flex flex-col items-center gap-[26px] text-center mb-[120px]">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal">
            Hidden Places
          </p>
          <h2 className="font-montserrat font-medium text-[40px] text-white capitalize leading-[54px]">
            Unexplored Gems of Mount Abu
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-end">
          {/* Left Content */}
          <div className="flex flex-col gap-[32px] max-w-[562px]">
            {/* Place name with animation */}
            <div className="flex flex-col gap-[24px]">
              <div className="h-[32px] overflow-hidden">
                <p className="font-baron text-[32px] text-[#d4af37] leading-normal">
                  {currentPlace.name}
                </p>
              </div>

              {/* Description */}
              <p className="font-montserrat font-medium text-[20px] text-[#f5f2e9] leading-[28px]">
                {currentPlace.description}
              </p>
            </div>

            {/* Bottom row - Button and Navigation */}
            <div className="flex items-center justify-between w-full">
              {/* View More Button */}
              <button
                className="px-[24px] py-[12px] rounded-[6px]"
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

              {/* Navigation arrows */}
              <div className="flex gap-[12px] items-center">
                <button
                  className="w-[44px] h-[44px] opacity-40 hover:opacity-60 transition-opacity"
                  aria-label="Previous"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? hiddenPlaces.length - 1 : prev - 1
                    )
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

                <button
                  className="w-[44px] h-[44px] hover:opacity-80 transition-opacity"
                  aria-label="Next"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === hiddenPlaces.length - 1 ? 0 : prev + 1
                    )
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
          </div>

          {/* Right Content - Image Cards */}
          <div className="relative w-[709px] h-[361px] overflow-hidden">
            {/* Featured card with gold border */}
            <div className="absolute left-0 top-0 w-[292px] h-[361px] rounded-[17px] border-[6px] border-[#d4af37] overflow-hidden">
              <Image
                src={cardImages[activeIndex]}
                alt={currentPlace.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Secondary cards */}
            <div className="absolute left-[312px] top-[63px] w-[228px] h-[298px] rounded-[17px] overflow-hidden">
              <Image
                src={cardImages[(activeIndex + 1) % cardImages.length]}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[17px]" />
            </div>

            <div className="absolute left-[560px] top-[63px] w-[228px] h-[298px] rounded-[17px] overflow-hidden">
              <Image
                src={cardImages[(activeIndex + 2) % cardImages.length]}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[17px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration - overlapping into About section */}
      <div className="absolute bottom-0 left-0 w-full h-[85px] z-20">
        <Image
          src="/images/wave-top.svg"
          alt=""
          fill
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}
