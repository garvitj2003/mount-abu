"use client";

import Image from "next/image";

// Minister Card Component
function MinisterCard({
  imageSrc,
  name,
  title,
}: {
  imageSrc: string;
  name: string | string[];
  title: string | string[];
}) {
  const nameArray = Array.isArray(name) ? name : [name];
  const titleArray = Array.isArray(title) ? title : [title];

  return (
    <div className="flex items-center shrink-0 w-[183px]">
      <div
        className="flex flex-col gap-5 items-center justify-center p-[18px] rounded-[12.8px] border border-[#d4af37] border-solid grow"
        style={{
          background: "rgba(19, 32, 25, 0.2)",
          backdropFilter: "blur(2.259px)",
          WebkitBackdropFilter: "blur(2.259px)",
        }}
      >
        {/* Profile Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-[115px] h-[115px] rounded-full overflow-hidden">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(245, 242, 233, 0.11)" }}
            />
            <div
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{
                backdropFilter: "blur(0.46px)",
                WebkitBackdropFilter: "blur(0.46px)",
              }}
            >
              <Image
                src={imageSrc}
                alt={nameArray.join(" ")}
                fill
                className="object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col gap-[14px] items-center justify-center text-[#f5f2e9] text-center grow">
            <div className="font-montserrat font-bold text-[18px] leading-normal capitalize w-full">
              {nameArray.map((line, i) => (
                <p key={i} className={i < nameArray.length - 1 ? "mb-0" : ""}>
                  {line}
                </p>
              ))}
            </div>
            <div className="font-montserrat font-medium text-[15px] leading-[21px]">
              {titleArray.map((line, i) => (
                <p key={i} className={i < titleArray.length - 1 ? "mb-0" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Header Component
function NavigationHeader() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-8"
      style={{
        background: "linear-gradient(to right, #1197ff, #3d96f0)",
      }}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="relative w-[45px] h-[45px] rounded-full overflow-hidden bg-white flex items-center justify-center">
          {/* Logo placeholder - mountain icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="text-[#1197ff]"
          >
            <circle cx="16" cy="16" r="14" fill="#4CAF50" />
            <path
              d="M8 22L12 14L16 18L22 10L26 22H8Z"
              fill="#2E7D32"
            />
            <circle cx="22" cy="10" r="3" fill="#FDD835" />
          </svg>
        </div>
        <span className="text-white font-montserrat font-semibold text-lg">
          Nagar Palika Mount Abu
        </span>
      </div>

      {/* Right side - Language and Menu */}
      <div className="flex items-center gap-6">
        <button className="px-4 py-2 border border-white rounded-lg text-white font-montserrat font-medium text-sm hover:bg-white/10 transition-colors">
          हिन्दी
        </button>
        <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen min-h-[900px] overflow-hidden">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Full-page Background Image - Hero */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-bg.png"
          alt="Mount Abu"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Bottom Gradient Overlay - Dark green fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-[300px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0.8) 40%, rgba(19, 32, 25, 0.4) 70%, transparent 100%)",
        }}
      />

      {/* Second gradient layer for deeper bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0.6) 60%, transparent 100%)",
        }}
      />

      {/* Hero Title Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-[100px] pt-[70px]">
        {/* Majestic Text */}
        <p
          className="font-montserrat font-medium italic text-[84px] text-[#f7be03] leading-none mb-[-20px]"
          style={{
            textShadow: "3px 2px 0px rgba(0, 0, 0, 0.5)",
          }}
        >
          Majestic
        </p>

        {/* Mount Abu Text */}
        <h1
          className="font-baron text-[160px] text-white font-bold leading-none tracking-tight"
          style={{
            textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          Mount Abu
        </h1>

        {/* Guru Shikhar Text */}
        <p
          className="font-montserrat font-bold text-[40px] text-[#f7be03] leading-none mt-2 ml-[500px]"
          style={{
            textShadow: "3px 2px 0px rgba(0, 0, 0, 0.5)",
          }}
        >
          Guru Shikhar
        </p>
      </div>

      {/* Explore Text - Centered at bottom */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p className="font-baron text-[20px] text-[#d4af37] leading-normal tracking-[0.2em] uppercase">
          EXPLORE
        </p>
      </div>

      {/* Minister Cards - Bottom right */}
      <div className="absolute bottom-[80px] right-[50px] flex gap-[21px] items-center">
        <MinisterCard
          imageSrc="/images/minister2.png"
          name={["Shri Bhajan", "Lal Sharma"]}
          title={["Chief Minister,", "Rajasthan"]}
        />
        <MinisterCard
          imageSrc="/images/minister1.png"
          name={["Shri Jhabar", "Singh Kharra"]}
          title={["Hon'ble Minister of", "UDH"]}
        />
      </div>
    </div>
  );
}
