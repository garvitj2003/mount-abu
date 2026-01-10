"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="relative w-full">
      {/* Main content area with cream background */}
      <div className="relative bg-[#f5f2e9] w-full overflow-hidden">
        {/* Background pattern with low opacity */}
        <div className="absolute inset-0 opacity-[0.14]">
          <Image
            src="/images/about-pattern.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-[120px] py-[80px]">
          {/* First About Block - Welcome to Mount Abu */}
          <div className="relative flex justify-between items-start mb-[80px]">
            {/* Left content */}
            <div className="flex flex-col gap-[33px] items-start max-w-[546px]">
              {/* Title section */}
              <div className="flex flex-col gap-[26px] items-start w-full">
                <p className="font-baron text-[24px] text-[#d4af37] leading-normal">
                  About
                </p>
                <div className="capitalize text-[#132019]">
                  <p className="font-montserrat font-medium text-[32px] leading-[44px] mb-0">
                    Welcome to
                  </p>
                  <p className="font-montserrat font-semibold text-[40px] leading-[44px]">
                    Mount Abu
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="font-montserrat font-medium text-[20px] text-black leading-[28px]">
                <p className="mb-0">Discover Rajasthan&apos;s Only Hill Station</p>
                <p className="mb-0">&nbsp;</p>
                <p className="mb-0">
                  Nestled in the Aravalli Hills, Mount Abu is Rajasthan&apos;s only
                  hill station—blessed with cool climate, lush greenery, serene
                  lakes, and ancient temples. A perfect blend of nature,
                  spirituality, and adventure, it welcomes travelers year-round.
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-[564px] h-[609px] rounded-[12px] overflow-hidden flex-shrink-0">
              <Image
                src="/images/about-sunset.png"
                alt="Mount Abu Sunset View"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Second About Block - Nagar Palika Mount Abu */}
          <div className="relative flex justify-between items-start">
            {/* Left image */}
            <div className="relative w-[602px] h-[598px] rounded-[12px] overflow-hidden flex-shrink-0">
              <Image
                src="/images/about-building.png"
                alt="Nagar Palika Mount Abu"
                fill
                className="object-cover"
              />
            </div>

            {/* Right content */}
            <div className="flex flex-col gap-[33px] items-end max-w-[546px] mt-[140px]">
              {/* Title section */}
              <div className="flex flex-col gap-[26px] items-end w-full">
                <p className="font-baron text-[24px] text-[#d4af37] leading-normal text-center">
                  About
                </p>
                <p className="font-montserrat font-medium text-[40px] text-[#132019] capitalize leading-[54px] text-right">
                  Nagar Palika Mount Abu
                </p>
              </div>

              {/* Description */}
              <div className="font-montserrat font-medium text-[20px] text-black leading-[28px] text-right">
                <p className="mb-0">Serving Our Community</p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Nagar Palika Mount Abu is dedicated to developing and
                  maintaining the city&apos;s beauty, infrastructure, and public
                  services. With a focus on tourism, sustainability, and citizen
                  welfare, it ensures Mount Abu remains clean, vibrant, and
                  welcoming for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="relative w-full h-[85px]">
        <Image
          src="/images/wave-bottom.svg"
          alt=""
          fill
          className="object-cover object-top rotate-180"
        />
      </div>
    </section>
  );
}
