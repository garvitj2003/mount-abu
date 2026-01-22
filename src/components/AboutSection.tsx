"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";

const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export default function AboutSection() {
    return (
        <section id="about" className="relative w-full overflow-hidden">
            {/* Main content area with cream background */}
            <div className="relative bg-[#f5f2e9] w-full py-10">
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
                <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-20">
                    {/* First About Block - Welcome to Mount Abu */}
                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-16 mb-16 md:mb-24">
                        {/* Left content -> Slides in from Left */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideFromLeft}
                            className="flex flex-col gap-6 md:gap-8 items-start w-full md:max-w-xl"
                        >
                            {/* Title section */}
                            <div className="flex flex-col gap-4 md:gap-6 items-start w-full">
                                <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal uppercase tracking-wider">
                                    About
                                </p>
                                <div className="capitalize text-[#132019]">
                                    <p className="font-montserrat font-medium text-2xl md:text-3xl leading-tight">
                                        Welcome to
                                    </p>
                                    <p className="font-montserrat font-semibold text-3xl md:text-4xl leading-tight">
                                        Mount Abu
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="font-montserrat font-medium text-base md:text-lg lg:text-xl text-black leading-relaxed">
                                <p className="font-bold mb-4">
                                    Discover Rajasthan&apos;s Only Hill Station
                                </p>
                                <p>
                                    Nestled in the Aravalli Hills, Mount Abu is
                                    Rajasthan&apos;s only hill station—blessed
                                    with cool climate, lush greenery, serene
                                    lakes, and ancient temples. A perfect blend
                                    of nature, spirituality, and adventure, it
                                    welcomes travelers year-round.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right image -> Slides in from Right */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideFromRight}
                            className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-square max-w-[564px] rounded-xl overflow-hidden shadow-xl"
                        >
                            <Image
                                src="/images/about-sunset.png"
                                alt="Mount Abu Sunset View"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Second About Block - Nagar Palika Mount Abu */}
                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-16">
                        {/* Left image -> Slides in from Left */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideFromLeft}
                            className="relative w-full md:w-1/2 aspect-4/5 md:aspect-square max-w-[602px] rounded-xl overflow-hidden shadow-xl order-2 md:order-1"
                        >
                            <Image
                                src="/images/about-building.png"
                                alt="Nagar Palika Mount Abu"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Right content -> Slides in from Right */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideFromRight}
                            className="flex flex-col gap-6 md:gap-8 items-start md:items-end w-full md:max-w-xl md:mt-24 order-1 md:order-2"
                        >
                            {/* Title section */}
                            <div className="flex flex-col gap-4 md:gap-6 items-start md:items-end w-full">
                                <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal uppercase tracking-wider">
                                    About
                                </p>
                                <p className="font-montserrat font-medium text-3xl md:text-4xl text-[#132019] capitalize leading-tight text-left md:text-right">
                                    Nagar Palika Mount Abu
                                </p>
                            </div>

                            {/* Description */}
                            <div className="font-montserrat font-medium text-base md:text-lg lg:text-xl text-black leading-relaxed text-left md:text-right">
                                <p className="font-bold mb-4">
                                    Serving Our Community
                                </p>
                                <p>
                                    Nagar Palika Mount Abu is dedicated to
                                    developing and maintaining the city&apos;s
                                    beauty, infrastructure, and public services.
                                    With a focus on tourism, sustainability, and
                                    citizen welfare, it ensures Mount Abu
                                    remains clean, vibrant, and welcoming for
                                    all.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="absolute lg:-bottom-20 -bottom-4 left-0 w-full overflow-hidden text-[#132019] ">
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
