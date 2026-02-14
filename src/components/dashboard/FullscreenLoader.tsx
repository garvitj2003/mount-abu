"use client";

import { motion } from "motion/react";

export default function FullscreenLoader() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-12 w-12 rounded-full border-4 border-[#0C83FF] border-t-transparent"
        />
        <p className="font-onest text-sm font-medium text-[#343434] animate-pulse">
          Getting you to the perfect place...
        </p>
      </div>
    </div>
  );
}
