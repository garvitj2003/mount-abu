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
        <div className="relative w-screen h-screen bg-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[200px] z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute bottom-0 left-0 w-full h-[150px] z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute w-full h-full inset-0 bg-none bg-[#132019]">
                <Image
                    src="/images/sections/Leadership.png"
                    fill
                    alt="testimonals"
                    className="object-cover opacity-30"
                />
            </div>

            <div className="relative z-20 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-[26px] mb-[80px] lg:mb-[120px]">
                    <h3 className="text-gold font-display text-2xl uppercase tracking-widest text-center">
                        Testimonials
                    </h3>
                    <h2 className="text-white font-sans font-medium text-4xl lg:text-5xl uppercase text-center">
                        Leadership messages
                    </h2>
                </div>

                {/* Speaker Section */}
                <div className="flex flex-col lg:flex-row items-center gap-[58px] max-w-[1140px] w-full">
                    {/* Image Column */}
                    <div className="relative flex-shrink-0">
                        <div className="relative w-[373px] h-[380px]">
                            <Image
                                src="/images/testimonials/quote-frame.svg"
                                width={373}
                                height={380}
                                alt="Frame"
                                className="absolute inset-0 z-0"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pl-4 pt-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentTestimonial.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-[320px] h-[320px] overflow-hidden rounded-full border-4 border-transparent"
                                    >
                                        <Image
                                            src={currentTestimonial.image}
                                            fill
                                            alt={currentTestimonial.name}
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col gap-[24px] text-center lg:text-left flex-grow">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col gap-[24px]"
                            >
                                <div className="flex flex-col gap-[12px]">
                                    <h4 className="text-gold font-display text-[32px] leading-none">
                                        {currentTestimonial.name}
                                    </h4>
                                    <p className="text-cream font-sans font-bold text-xl uppercase tracking-wide">
                                        {currentTestimonial.title}
                                    </p>
                                </div>

                                {/* Fixed height container for message to prevent button jumping */}
                                <div className="min-h-[220px] flex items-start justify-center lg:justify-start">
                                    <p className="text-cream font-sans font-medium text-lg lg:text-xl leading-[1.4] max-w-[700px]">
                                        {currentTestimonial.message}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-[20px] flex items-center justify-center lg:justify-start gap-4">
                            <button 
                                onClick={handlePrev} 
                                className="transition-transform hover:scale-110 focus:outline-none rotate-180"
                                aria-label="Previous testimonial"
                            >
                                <Image
                                    src="/images/nav-next.svg" // Using nav-next.svg and rotating it for prev
                                    width={44}
                                    height={44}
                                    alt="Previous"
                                />
                            </button>
                            <button 
                                onClick={handleNext} 
                                className="transition-transform hover:scale-110 focus:outline-none"
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
        </div>
    );
}
