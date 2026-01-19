"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Testimonial {
    id: number;
    name: string;
    title: string;
    message: string;
    image: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Shri Bhajan Lal Sharma",
        title: "Chief Minister, Rajasthan",
        message: "Mount Abu is not only a crown jewel of Rajasthan's tourism but also a symbol of our state's commitment to sustainable development and civic excellence. As Chief Minister, I am proud of the efforts being made by the Mount Abu Nagar Palika to preserve its natural beauty and enhance the quality of life for its residents and visitors. I encourage every citizen and tourist to experience the unique blend of spirituality, history, and nature that Mount Abu offers, and I assure continued support from the state government for its growth and prosperity.",
        image: "/images/testimonials/cm-photo.png"
    },
    {
        id: 2,
        name: "Smt. Diya Kumari",
        title: "Deputy Chief Minister, Rajasthan",
        message: "Tourism in Rajasthan is incomplete without the serene beauty of Mount Abu. We are committed to developing world-class infrastructure while preserving the ecological balance of this hill station. Our goal is to make Mount Abu a top destination for both domestic and international travelers, offering them a memorable experience of Rajasthani hospitality and natural splendor.",
        image: "/images/testimonials/cm-photo.png" // Placeholder image
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentTestimonial = TESTIMONIALS[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <section className="relative w-full min-h-screen bg-[#132019] overflow-hidden flex items-center py-16 md:py-24">
            <div className="absolute top-0 left-0 w-full h-48 md:h-64 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute bottom-0 left-0 w-full h-40 md:h-52 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute inset-0">
                <Image
                    src="/images/sections/Leadership.png"
                    fill
                    alt="testimonials background"
                    className="object-cover opacity-30"
                />
            </div>

            <div className="relative z-20 container mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 mb-12 md:mb-16">
                    <h3 className="text-[#d4af37] font-display text-xl md:text-2xl uppercase tracking-[0.2em] text-center">
                        Testimonials
                    </h3>
                    <h2 className="text-white font-sans font-medium text-3xl md:text-4xl lg:text-5xl uppercase text-center leading-tight">
                        Leadership messages
                    </h2>
                </div>

                {/* Speaker Section */}
                <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 max-w-6xl mx-auto w-full">
                    {/* Image Column */}
                    <div className="relative flex-shrink-0 w-full max-w-[320px] md:max-w-[380px] aspect-square">
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/testimonials/quote-frame.svg"
                                fill
                                alt="Frame"
                                className="absolute inset-0 z-0 object-contain"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentTestimonial.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full h-full overflow-hidden rounded-full border-4 border-transparent scale-120"
                                    >
                                        <Image
                                            src={currentTestimonial.image}
                                            fill
                                            alt={currentTestimonial.name}
                                            className="object-contain"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col gap-6 text-center lg:text-left flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[#d4af37] font-display text-2xl md:text-3xl lg:text-4xl leading-tight">
                                        {currentTestimonial.name}
                                    </h4>
                                    <p className="text-[#f5f2e9] font-sans font-bold text-lg md:text-xl uppercase tracking-wider">
                                        {currentTestimonial.title}
                                    </p>
                                </div>

                                <div className="min-h-[180px] md:min-h-[220px] flex items-start justify-center lg:justify-start">
                                    <p className="text-[#f5f2e9] font-sans font-medium text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                                        {currentTestimonial.message}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-4 flex items-center justify-center lg:justify-start gap-4">
                            <button 
                                onClick={handlePrev} 
                                className="w-11 h-11 rounded-full opacity-40 hover:opacity-60 transition-opacity"
                                aria-label="Previous testimonial"
                            >
                                <Image
                                    src="/images/nav-prev.svg"
                                    width={44}
                                    height={44}
                                    alt="Previous"
                                    className="rotate-180"
                                />
                            </button>
                            <button 
                                onClick={handleNext} 
                                className="w-11 h-11 rounded-full hover:opacity-80 transition-opacity"
                                aria-label="Next testimonial"
                            >
                                <Image
                                    src="/images/nav-next.svg"
                                    width={44}
                                    height={44}
                                    alt="Next"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
