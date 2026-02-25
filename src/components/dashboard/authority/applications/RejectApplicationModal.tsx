"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface RejectApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  isPending?: boolean;
}

export default function RejectApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: RejectApplicationModalProps) {
  const [remarks, setRemarks] = useState("");

  const handleConfirm = () => {
    if (!remarks.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    onConfirm(remarks);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-[407px] overflow-hidden rounded-xl bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] p-4 px-5">
              <h2 className="text-[15px] font-medium text-[#343434]">
                Reject Application
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
            <div className="flex flex-col items-center gap-4 p-6 pt-8">
              {/* Reject Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444]">
                   <Image src="/dashboard/icons/cross-round-red.svg" alt="" width={24} height={24} className="invert brightness-0" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-[16px] font-semibold text-[#343434]">
                  Are you sure?
                </h3>
                <p className="text-[16px] font-semibold text-[#343434]">
                  You want to reject this application?
                </p>
              </div>

              <div className="h-px w-full bg-[#D6D9DE] my-2" />

              <textarea
                placeholder="Enter your reason to reject this application."
                className="w-full h-[160px] resize-none rounded-xl border border-[#D6D9DE] p-4 text-[13px] text-[#343434] outline-none focus:border-[#EF4444] placeholder:opacity-40 font-normal"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button
                onClick={onClose}
                className="flex-1 h-[48px] rounded-lg border border-[#D6D9DE] bg-white text-sm font-semibold text-[#343434] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending || !remarks.trim()}
                className="flex-1 h-[48px] flex items-center justify-center gap-2 rounded-lg bg-[#EF4444] text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {!isPending && <Image src="/dashboard/icons/cross-round-red.svg" alt="" width={18} height={18} className="invert brightness-0" />}
                {isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
