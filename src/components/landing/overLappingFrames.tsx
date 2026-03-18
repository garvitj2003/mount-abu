"use client";
import Image from "next/image";
import { motion, easeInOut } from "motion/react";
import { usePathname } from "next/navigation";

export default function OverlappingFrames() {
    const pathname = usePathname();
    
    // Only render on the landing page
    if (pathname !== "/") return null;

    // Configuration for the immediate exit animation
    const exitTransition = { duration: 3, ease: easeInOut, delay: 0.5 };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden z-[9999] pointer-events-none">
            <motion.div
                className="absolute inset-0 bg-[#ffffff] z-0" // Using white to blend with clouds. Change hex if clouds are off-white.
                initial={{ opacity: 1 }}
                animate={{
                    opacity: 0,
                    transition: { duration: 0.4, ease: easeInOut, delay: 0.2 }, // Matches the cloud movement timing
                }}
            />

            <motion.div
                className="absolute w-full h-full -top-1/4 -left-1/4 z-10" // Adjusted positioning
                // Start: Visible and floating in place
                initial={{
                    opacity: 1,
                    scale: 2.5, // Increased scale to hide corners
                    rotate: 10,
                    x: 0,
                    y: 0,
                }}
                // End: Flies away to Top Left immediately on load
                animate={{
                    opacity: 0,
                    x: -1200, // Increased travel distance
                    y: -1200,
                    transition: exitTransition,
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>

            {/* Frame 2: Starts visible, Animations to Bottom Right */}
            <motion.div
                className="absolute inset-0 -bottom-1/4 -right-1/4 z-10"
                initial={{
                    opacity: 1,
                    scale: 2.5, // Increased scale
                    rotate: 120,
                    x: 0,
                    y: 0,
                }}
                animate={{
                    opacity: 0,
                    x: 1200,
                    y: 1200,
                    transition: { ...exitTransition, delay: 0.1 },
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>

            {/* Frame 3: Starts visible, Animations to Bottom Left */}
            <motion.div
                className="absolute inset-0 -bottom-1/2 -left-1/2 z-10"
                initial={{
                    opacity: 1,
                    scale: 2.5, // Increased scale
                    rotate: 0,
                    x: 0,
                    y: 0,
                }}
                animate={{
                    opacity: 0,
                    x: -1200,
                    y: 1200,
                    transition: { ...exitTransition, delay: 0 },
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
            </motion.div>
        </div>
    );
}
