"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface WardMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WardMapModal({ isOpen, onClose }: WardMapModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-5 py-3 font-onest">
              <h3 className="text-[15px] font-medium text-[#343434]">Ward Map</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image
                  src="/dashboard/icons/close.svg"
                  alt="Close"
                  width={16}
                  height={16}
                />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full max-h-[80vh] overflow-y-auto bg-white p-4">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src="/dashboard/images/ward-map.jpeg" 
                 alt="Ward Map" 
                 className="w-full h-auto object-contain rounded-lg"
               />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
