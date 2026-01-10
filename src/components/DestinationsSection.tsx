"use client";

import Image from "next/image";

// Destination data
const destinations = [
  {
    id: 1,
    image: "/images/dest-card-1.png",
    title: "Nakki Lake",
    description: "A serene lake surrounded by hills, perfect for boating and enjoying nature.",
  },
  {
    id: 2,
    image: "/images/dest-card-2.png",
    title: "Sunset Point",
    description: "One of the highest peaks offering breathtaking views of the sunset.",
  },
  {
    id: 3,
    image: "/images/dest-card-3.png",
    title: "Guru Shikhar",
    description: "The highest peak of the Aravalli Range with panoramic views.",
  },
  {
    id: 4,
    image: "/images/dest-center-1.png",
    title: "Dilwara Temples",
    description: "The Dilwara Temples are celebrated for their exquisite white marble carvings and architectural brilliance.",
    featured: true,
  },
  {
    id: 5,
    image: "/images/dest-card-4.png",
    title: "Achalgarh Fort",
    description: "An ancient fort with historical significance and stunning architecture.",
  },
];

export default function DestinationsSection() {
  return (
    <section className="relative w-full min-h-[900px] bg-[#132019] overflow-hidden">
      {/* Background Image with opacity */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/destination-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Top gradient overlay */}
      <div
        className="absolute top-0 left-0 w-full h-[484px]"
        style={{
          background: "linear-gradient(to bottom, #132019 0%, rgba(108, 100, 73, 0) 100%)",
        }}
      />

      {/* Second top gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[433px]"
        style={{
          background: "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-[212px]"
        style={{
          background: "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-[85px]">
        {/* Title */}
        <div className="flex flex-col items-center gap-[40px] text-center">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal tracking-wide">
            Destinations
          </p>
          <h2 className="text-[#f5f2e9] capitalize">
            <span
              className="font-montserrat font-medium text-[40px] leading-[54px]"
              style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.5)" }}
            >
              Top Destinations to visit{" "}
            </span>
            <span
              className="font-montserrat font-semibold text-[48px] leading-[54px]"
              style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.5)" }}
            >
              Mount Abu
            </span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative w-full max-w-[1224px] h-[520px] mt-[60px] mx-auto">
          {/* Side cards container */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {/* Left outer card */}
            <div className="relative w-[331px] h-[408px] rounded-[13px] overflow-hidden opacity-70">
              <Image
                src="/images/dest-card-1.png"
                alt="Nakki Lake"
                fill
                className="object-cover"
              />
            </div>

            {/* Right outer card */}
            <div className="relative w-[331px] h-[408px] rounded-[13px] overflow-hidden opacity-70">
              <Image
                src="/images/dest-card-2.png"
                alt="Sunset Point"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Inner cards container */}
          <div className="absolute inset-0 flex items-center justify-center gap-[220px]">
            {/* Left inner card */}
            <div className="relative w-[331px] h-[408px] rounded-[13px] overflow-hidden">
              <Image
                src="/images/dest-card-3.png"
                alt="Guru Shikhar"
                fill
                className="object-cover"
              />
            </div>

            {/* Right inner card */}
            <div className="relative w-[331px] h-[408px] rounded-[13px] overflow-hidden">
              <Image
                src="/images/dest-card-4.png"
                alt="Achalgarh Fort"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Center featured card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[419px] h-[482px] rounded-[13px] overflow-hidden border-4 border-[#122018] z-20">
            {/* Card image */}
            <Image
              src="/images/dest-center-1.png"
              alt="Dilwara Temples"
              fill
              className="object-cover"
            />

            {/* Gradient overlay */}
            <div
              className="absolute bottom-0 left-0 w-full h-[242px]"
              style={{
                background: "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0) 100%)",
                backdropFilter: "blur(2.2px)",
                WebkitBackdropFilter: "blur(2.2px)",
              }}
            />

            {/* Arrow button */}
            <div className="absolute top-[11px] right-[11px] w-[63px] h-[63px] bg-black rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Card content */}
            <div className="absolute bottom-[30px] left-[27px] right-[27px] text-[#f5f2e9]">
              <h3 className="font-montserrat font-bold text-[22px] capitalize leading-[66px]">
                Dilwara Temples
              </h3>
              <p className="font-montserrat font-medium text-[17.6px] leading-[31px]">
                The Dilwara Temples are celebrated for their exquisite white marble carvings and architectural brilliance.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-[12px] mt-[40px]">
          {/* Previous button */}
          <button
            className="w-[44px] h-[44px] rounded-full opacity-40 hover:opacity-60 transition-opacity"
            aria-label="Previous slide"
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
            className="w-[44px] h-[44px] rounded-full hover:opacity-80 transition-opacity"
            aria-label="Next slide"
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
