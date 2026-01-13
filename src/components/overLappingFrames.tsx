"use client"
import Image from "next/image";
import { motion, easeInOut } from "motion/react";

export default function OverlappingFrames() {
    // Configuration for the immediate exit animation
    const exitTransition = { duration: 3, ease: easeInOut, delay: 0.5 };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            
            {/* QUICK FIX: THE CURTAIN LAYER 
               This solid color loads instantly (faster than images) to block the view
               of the Hero section immediately, preventing the glitch/flash.
               It fades out as the clouds fly away.
            */}
            <motion.div 
                className="absolute inset-0 bg-[#ffffff] z-0" // Using white to blend with clouds. Change hex if clouds are off-white.
                initial={{ opacity: 1 }}
                animate={{ 
                    opacity: 0,
                    transition: { duration: 1.2, ease: easeInOut, delay: 0.2 } // Matches the cloud movement timing
                }}
            />

            {/* Frame 1: Starts visible, Animations to Top Left */}
            <motion.div 
                className="absolute w-full h-full -top-1/3 -left-30 z-10" // Added z-10 to sit above curtain
                // Start: Visible and floating in place
                initial={{ 
                    opacity: 1, 
                    scale: 1.6, 
                    rotate: 10, 
                    x: 0, 
                    y: 0 
                }}
                // End: Flies away to Top Left immediately on load
                animate={{ 
                    opacity: 0, 
                    x: -1000, 
                    y: -1000, 
                    transition: exitTransition 
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>

            {/* Frame 2: Starts visible, Animations to Bottom Right */}
            <motion.div 
                className="absolute inset-0 -bottom-1/3 -right-1/3 z-10"
                initial={{ 
                    opacity: 1, 
                    scale: 1.4, 
                    rotate: 120, 
                    x: 0, 
                    y: 0 
                }}
                animate={{ 
                    opacity: 0, 
                    x: 1000, 
                    y: 1000, 
                    transition: { ...exitTransition, delay: 0.1 }
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>

            {/* Frame 3: Starts visible, Animations to Bottom Left */}
            <motion.div 
                className="absolute inset-0 -bottom-1/2 -left-1/2 z-10"
                initial={{ 
                    opacity: 1, 
                    scale: 1.5, 
                    rotate: 0, 
                    x: 0, 
                    y: 0 
                }}
                animate={{ 
                    opacity: 0, 
                    x: -1000, 
                    y: 1000, 
                    transition: { ...exitTransition, delay: 0 } 
                }}
            >
                <Image
                    src="/images/cloud/clouds-cut.png"
                    alt="cloud layer"
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>
        </div>
    );
}