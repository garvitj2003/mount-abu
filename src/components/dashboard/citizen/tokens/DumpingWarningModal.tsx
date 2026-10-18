"use client";

import { motion, AnimatePresence } from "motion/react";

interface DumpingWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  vehicleNumber?: string | null;
  entryDate?: string | Date | null;
}

export default function DumpingWarningModal({
  isOpen,
  onClose,
  onProceed,
  vehicleNumber,
  entryDate,
}: DumpingWarningModalProps) {
  const formattedDate = entryDate
    ? new Date(entryDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="dumping-warning-modal-wrapper" className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-amber-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 border border-amber-300">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Dumping Photos Not Uploaded
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Previous vehicle entry verification pending
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 text-xs">
                <span className="font-semibold text-amber-900">Last Vehicle Entry</span>
                <span className="font-mono font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                  {vehicleNumber || "Previous Entry"}
                </span>
              </div>

              {formattedDate && (
                <div className="flex items-center justify-between text-[11px] text-amber-800">
                  <span>Entry Time:</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
              )}

              <p className="text-xs text-amber-900 leading-relaxed">
                The dumping images of your last vehicle entry{" "}
                {vehicleNumber ? (
                  <strong className="font-semibold">({vehicleNumber})</strong>
                ) : (
                  ""
                )}{" "}
                have not been uploaded yet.
              </p>
              <div className="rounded-lg bg-white/80 p-2.5 border border-amber-300 text-[11px] text-amber-900 leading-normal">
                ⚠️ <strong className="font-semibold">Important Notice:</strong> If dumping photos are not uploaded soon, future vehicle scheduling can be blocked by municipal authorities. Please upload them at the earliest.
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onProceed}
                className="rounded-xl bg-[#0C83FF] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>I Understand, Proceed to Schedule</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
