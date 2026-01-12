"use client"
import Image from "next/image";
import { motion, easeInOut } from "motion/react";

export default function OverlappingFrames() {
    // Configuration for the immediate exit animation
    const exitTransition = { duration: 2.5, ease: easeInOut, delay: 0.1 };

    return (
        <div className="relative w-screen bg-black h-screen overflow-hidden">
            
            {/* Frame 1: Starts visible, Animations to Top Left */}
            <motion.div 
                className="absolute w-full h-full -top-1/3 -left-30"
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
                    x: -1000, // Large value to ensure it clears the screen
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
                className="absolute inset-0 -bottom-1/3 -right-1/3"
                // Start: Visible
                initial={{ 
                    opacity: 1, 
                    scale: 1.4, 
                    rotate: 120, 
                    x: 0, 
                    y: 0 
                }}
                // End: Flies away to Bottom Right
                animate={{ 
                    opacity: 0, 
                    x: 1000, 
                    y: 1000, 
                    transition: { ...exitTransition, delay: 0.1 } // Slight stagger
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
                className="absolute inset-0 -bottom-1/2 -left-1/2"
                // Start: Visible
                initial={{ 
                    opacity: 1, 
                    scale: 1.5, 
                    rotate: 0, 
                    x: 0, 
                    y: 0 
                }}
                // End: Flies away to Bottom Left
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