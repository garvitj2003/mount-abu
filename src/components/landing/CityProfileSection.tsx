"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useSuspenseCityProfile } from "@/hooks/useCityProfile";

// --- Helper: Individual Slot Digit ---
function SlotDigit({
    value,
    delay,
}: {
    place: number;
    value: string;
    delay: number;
}) {
    const target = parseInt(value);
    if (isNaN(target)) return <span>{value}</span>;

    const slots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const landingIndex = 10 + target;
    const height = 30;

    return (
        <div className="relative inline-block h-[30px] overflow-hidden align-bottom">
            <motion.div
                initial={{ y: 0 }}
                whileInView={{ y: -1 * landingIndex * height }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    duration: 1.2,
                    ease: [0.25, 1, 0.5, 1],
                    delay: delay,
                }}
                className="flex flex-col items-center"
            >
                {slots.map((num, i) => (
                    <span
                        key={i}
                        className="flex items-center justify-center h-[30px] leading-[30px]"
                    >
                        {num}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// --- Helper: Slot Counter Wrapper ---
function SlotCounter({ value }: { value: string }) {
    const match = value.match(/^([\d,.]+)(.*)$/);

    if (!match) return <span>{value}</span>;

    const numericPart = match[1];
    const suffix = match[2];
    const chars = numericPart.split("");

    return (
        <div className="inline-flex items-baseline overflow-hidden">
            {chars.map((char, index) => {
                const isDigit = /\d/.test(char);

                if (!isDigit) {
                    return (
                        <span
                            key={index}
                            className="h-[30px] flex items-center"
                        >
                            {char}
                        </span>
                    );
                }

                return (
                    <SlotDigit
                        key={index}
                        place={index}
                        value={char}
                        delay={index * 0.2}
                    />
                );
            })}
            <span className="h-[30px] flex items-center">{suffix}</span>
        </div>
    );
}

// --- Stat Row Component ---
function StatRow({
    label,
    value,
    isLink = false,
}: {
    label: string;
    value: string;
    isLink?: boolean;
}) {
    return (
        <div className="flex items-start justify-between w-full font-poppins text-lg md:text-2xl text-[#f5f2e9]">
            <p className="leading-tight flex-1 pr-4">{label}</p>
            {isLink ? (
                <div className="leading-tight shrink-0 text-[#d4af37] underline cursor-pointer text-right">
                    {value}
                </div>
            ) : (
                <div className="leading-tight shrink-0 font-medium text-right">
                    <SlotCounter value={value} />
                </div>
            )}
        </div>
    );
}

// --- Card Component ---
function StatCard({
    title,
    children,
    className = "",
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`group relative overflow-hidden border border-[#d4af37] rounded-3xl p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] ${className}`}
            style={{
                background: "rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
            }}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out rotate-12 pointer-events-none z-30 scale-[2.5]" />

            {title && (
                <div className="flex items-start justify-between w-full mb-4 md:mb-5 relative z-10">
                    <p className="font-poppins font-medium text-xl md:text-2xl text-[#f5f2e9] leading-normal">
                        {title}
                    </p>
                </div>
            )}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}

export default function CityProfileSection() {
    const { data } = useSuspenseCityProfile();

    const areaStats = [
        { label: "Area In Sq. km.", value: data.area_sq_km || "0" },
        { label: "No. of wards", value: (data.no_of_wards || 0).toString() },
        { label: "Population estimate", value: (data.population_estimate || 0).toLocaleString() },
        { label: "Ward boundries", value: data.ward_boundaries || "Attached", isLink: true },
        { label: "Rental Properties of corporation", value: (data.rental_properties_of_corporation || 0).toString() },
        { label: "Number of Slums", value: (data.number_of_slums || 0).toString() },
        { label: "Solid waste per day", value: data.solid_waste_per_day || "0 Tones" },
        { label: "Street Light poles", value: (data.street_light_poles || 0).toString() },
        { label: "No. of employee in the municipal board", value: (data.employees_in_board || 0).toString() },
    ];

    const houseHoldsStats = [
        { label: "Residential", value: (data.households_residential || 0).toString() },
        { label: "Shops & Offices", value: (data.households_shops_offices || 0).toString() },
        { label: "Open Plots", value: (data.households_open_plots || 0).toString() },
    ];

    const birthDeathStats = [
        { label: "Registration per year", value: (data.birth_registration_per_year || 0).toString() },
        { label: "Certificate per year", value: (data.birth_certificate_per_year || 0).toString() },
    ];

    return (
        <section id="city-profile" className="relative w-full min-h-screen bg-[#17261e] overflow-hidden flex items-center justify-center py-16 md:py-24">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[rgba(81,73,51,0.6)]" />
                <div
                    className="absolute inset-0 opacity-30 md:bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/brahma-kumari-bg.png')",
                    }}
                />
            </div>

            {/* Gradient overlays */}
            <div
                className="absolute top-0 left-0 w-full h-48 md:h-64"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-full h-48 md:h-64"
                style={{
                    background:
                        "linear-gradient(to top, #7F6D54 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-20.5">
                {/* Title Section */}
                <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-12 md:mb-16">
                    <p className="font-baron text-xl md:text-2xl text-[#d4af37] leading-normal uppercase tracking-wider">
                        CITY PROFILE
                    </p>
                    <h2 className="font-poppins font-medium text-3xl md:text-4xl lg:text-5xl text-white capitalize leading-tight">
                        Mount Abu and its environment
                    </h2>
                </div>

                {/* Stats Grid - Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left large card - Area stats */}
                    <div className="lg:col-span-6 flex">
                        <StatCard className="w-full flex flex-col items-center justify-center py-8">
                            <div className="flex flex-col gap-6 md:gap-8 w-full">
                                {areaStats.map((stat, index) => (
                                    <StatRow
                                        key={index}
                                        label={stat.label}
                                        value={stat.value}
                                        isLink={stat.isLink}
                                    />
                                ))}
                            </div>
                        </StatCard>
                    </div>

                    {/* Right side - Two stacked cards */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        {/* Top right card - House holds */}
                        <StatCard
                            title="No of House holds"
                            className="w-full flex-1 flex flex-col gap-4 md:gap-5 items-center justify-center py-8"
                        >
                            <div className="flex flex-col gap-4 md:gap-5 w-full">
                                {houseHoldsStats.map((stat, index) => (
                                    <StatRow
                                        key={index}
                                        label={stat.label}
                                        value={stat.value}
                                    />
                                ))}
                            </div>
                        </StatCard>

                        {/* Bottom right card - Birth/Death */}
                        <StatCard
                            title="Birth/Death"
                            className="w-full flex-1 flex flex-col gap-4 md:gap-5 items-center justify-center py-8"
                        >
                            <div className="flex flex-col gap-4 md:gap-5 w-full">
                                {birthDeathStats.map((stat, index) => (
                                    <StatRow
                                        key={index}
                                        label={stat.label}
                                        value={stat.value}
                                    />
                                ))}
                            </div>
                        </StatCard>
                    </div>
                </div>
            </div>
        </section>
    );
}
