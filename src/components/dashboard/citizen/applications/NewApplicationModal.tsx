"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewApplicationModal({
  isOpen,
  onClose,
}: NewApplicationModalProps) {
  const router = useRouter();

  const handleSelect = (type: string) => {
    onClose();
    router.push("/citizen/applications/new-application");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-[407px] overflow-hidden rounded-lg bg-white shadow-2xl font-onest"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] p-4">
              <h2 className="text-sm font-medium text-[#343434]">
                Apply for new application
              </h2>
              <button
                onClick={onClose}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image
                  src="/dashboard/icons/close.svg"
                  alt="Close"
                  width={14}
                  height={14}
                />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center gap-5 p-5 px-4">
              <h3 className="w-full text-base font-bold text-[#343434]">
                Choose your Application type
              </h3>

              <div className="flex w-full items-center gap-5">
                {/* New Construction */}
                <button
                  onClick={() => handleSelect("new")}
                  className="group cursor-pointer relative flex h-[140px] flex-1 flex-col items-center justify-end overflow-hidden rounded-lg border border-[#D6D9DE] pb-4 transition-all hover:border-[#0C83FF]"
                >
                  <Image
                    src="/dashboard/images/applications/new-construction-bg.png"
                    alt="New Construction"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 transition-all group-hover:to-[#0C83FF]" />
                  <span className="relative z-10 text-sm font-normal text-black transition-colors group-hover:text-white">
                    New Construction
                  </span>
                </button>

                {/* Renovation */}
                <button
                  onClick={() => handleSelect("renovation")}
                  className="group cursor-pointer relative flex h-[140px] flex-1 flex-col items-center justify-end overflow-hidden rounded-lg border border-[#D6D9DE] pb-4 transition-all hover:border-[#0C83FF]"
                >
                  <Image
                    src="/dashboard/images/applications/renovation-bg.png"
                    alt="Renovation"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 transition-all group-hover:to-[#0C83FF]" />
                  <span className="relative z-10 text-sm font-normal text-black transition-colors group-hover:text-white">
                    Renovation
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
