"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface VehicleFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Tag = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
  <div className="flex items-center gap-1 rounded bg-[#E7F3FF] px-2 py-1 text-sm font-normal text-[#343434]">
    {text}
    <button onClick={onRemove} className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-blue-200">
      <Image src="/dashboard/icons/close.svg" alt="remove" width={10} height={10} className="opacity-60" />
    </button>
  </div>
);

export default function VehicleFilterDrawer({
  isOpen,
  onClose,
}: VehicleFilterDrawerProps) {
  const [tokens, setTokens] = useState(["TKN-2025-014", "TKN-2025-019"]);
  const [vehicles, setVehicles] = useState(["RJ24 AB 4587"]);
  const [materials, setMaterials] = useState(["Cement", "Sand"]);
  const [aiMatched, setMatched] = useState(true);
  const [aiUnmatched, setUnmatched] = useState(false);
  const [fromDate, setFromDate] = useState("05 Oct 2025");
  const [toDate, setToDate] = useState("");

  const handleApply = () => {
    // Filter logic will be implemented here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                Vehicle Records Fliter
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image
                  src="/dashboard/icons/close.svg"
                  alt="Close"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Token Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Token Number</label>
                <div className="relative flex min-h-[38px] w-full flex-wrap gap-2 rounded-lg border border-[#D6D9DE] bg-white px-2 py-1.5 pr-8">
                  {tokens.map((t) => (
                    <Tag key={t} text={t} onRemove={() => setTokens(prev => prev.filter(x => x !== t))} />
                  ))}
                  <div className="pointer-events-none absolute right-3 top-[11px]">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
                  </div>
                </div>
              </div>

              {/* Vehicle Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Vehicle Number</label>
                <div className="relative flex min-h-[38px] w-full flex-wrap gap-2 rounded-lg border border-[#D6D9DE] bg-white px-2 py-1.5 pr-8">
                  {vehicles.map((v) => (
                    <Tag key={v} text={v} onRemove={() => setVehicles(prev => prev.filter(x => x !== v))} />
                  ))}
                  <div className="pointer-events-none absolute right-3 top-[11px]">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
                  </div>
                </div>
              </div>

              {/* Material Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Material Type</label>
                <div className="relative flex min-h-[38px] w-full flex-wrap gap-2 rounded-lg border border-[#D6D9DE] bg-white px-2 py-1.5 pr-8">
                  {materials.map((m) => (
                    <Tag key={m} text={m} onRemove={() => setMaterials(prev => prev.filter(x => x !== m))} />
                  ))}
                  <div className="pointer-events-none absolute right-3 top-[11px]">
                    <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
                  </div>
                </div>
              </div>

              {/* AI Plate Recognition */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#343434]">AI Number Plate Recognization</p>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" className="hidden" checked={aiMatched} onChange={() => setMatched(!aiMatched)} />
                    <div className="h-5 w-5 flex items-center justify-center">
                      {aiMatched ? (
                        <Image src="/dashboard/icons/select-tick.svg" alt="checked" width={20} height={20} />
                      ) : (
                        <div className="h-5 w-5 rounded border border-[#D6D9DE] bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-normal text-[#343434]">Matched</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" className="hidden" checked={aiUnmatched} onChange={() => setUnmatched(!aiUnmatched)} />
                    <div className="h-5 w-5 flex items-center justify-center">
                      {aiUnmatched ? (
                        <Image src="/dashboard/icons/select-tick.svg" alt="checked" width={20} height={20} />
                      ) : (
                        <div className="h-5 w-5 rounded border border-[#D6D9DE] bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-normal text-[#343434]">Unmatched</span>
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">From Date</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Choose Date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full h-[38px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm text-[#343434] outline-none"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                        <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6667 1.33301V4.00033" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33337 1.33301V4.00033" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 6.66699H14" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">To Date</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Choose Date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full h-[38px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm text-[#343434] outline-none"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                        <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6667 1.33301V4.00033" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33337 1.33301V4.00033" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 6.66699H14" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white mt-auto">
              <button 
                onClick={onClose}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleApply}
                className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Filter Records
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
