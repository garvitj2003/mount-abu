"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";

type TokenDetailResponse = components["schemas"]["TokenDetailResponse"];

interface CompleteTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  token: TokenDetailResponse;
  isPending?: boolean;
}

export default function CompleteTokenModal({
  isOpen,
  onClose,
  onConfirm,
  token,
  isPending = false,
}: CompleteTokenModalProps) {
  const [remarks, setRemarks] = useState("");

  const materials = token.materials || [];
  const currentPhase = token.phase || 1;
  const totalPhases = token.total_phases || 1;
  const isFinalPhase = currentPhase >= totalPhases;
  const nextPhase = currentPhase + 1;

  const handleConfirm = () => {
    onConfirm(remarks.trim());
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
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-xl bg-white shadow-xl font-onest flex flex-col border border-[#D6D9DE]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111827]">
                  Complete Phase {token.phase} Token
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Token No: <span className="font-medium text-[#111827]">{token.token_number}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 p-6 max-h-[75vh] overflow-y-auto">
              {/* Warning Notice Banner - Red Highlighted without Emojis */}
              <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0 text-rose-600">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M8 5.33333V8.66667M8 11.3333H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-xs leading-relaxed text-rose-900">
                    <span className="font-semibold uppercase tracking-wider text-[11px] block mb-0.5 text-rose-700">
                      {isFinalPhase ? "Warning: Final Token of Application" : "Warning: Irreversible Action"}
                    </span>
                    {isFinalPhase
                      ? "This is the LAST token for this application. Completing it terminates vehicle transit immediately. Any unutilized material quota will expire with no further tokens or rollovers."
                      : `This will mark Phase ${currentPhase} as completed. All remaining material quota will roll over to Phase ${nextPhase}, and Phase ${nextPhase} will be unlocked.`}
                  </div>
                </div>
              </div>

              {/* Material Balance Summary Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                    Material Balance
                  </span>
                  <span className="text-[11px] font-medium text-[#6B7280]">
                    {materials.length} item{materials.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="py-2.5 px-3 font-semibold text-[#4B5563]">Material</th>
                        <th className="py-2.5 px-3 font-semibold text-[#4B5563] text-right">Permitted</th>
                        <th className="py-2.5 px-3 font-semibold text-[#4B5563] text-right">Consumed</th>
                        <th className="py-2.5 px-3 font-semibold text-right text-[#4B5563]">
                          {isFinalPhase ? "Unused" : `Rollover (Ph ${nextPhase})`}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {materials.map((m, idx) => {
                        const remaining = Number(m.remaining_quantity) || 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-[#111827]">
                              {m.material_name} <span className="font-normal text-[#6B7280]">({m.unit})</span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-[#4B5563]">{m.approved_quantity}</td>
                            <td className="py-2.5 px-3 text-right text-[#4B5563]">{m.consumed_quantity}</td>
                            <td className={`py-2.5 px-3 text-right font-medium ${isFinalPhase ? "text-rose-600" : remaining > 0 ? "text-emerald-600 font-semibold" : "text-[#9CA3AF]"}`}>
                              {remaining > 0 ? (isFinalPhase ? `${remaining} ${m.unit}` : `+${remaining} ${m.unit}`) : "0"}
                            </td>
                          </tr>
                        );
                      })}
                      {materials.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-xs text-[#9CA3AF] italic">
                            No materials recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#374151]">
                  Remarks / Reason <span className="text-[#9CA3AF]">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter remarks for token completion..."
                  className="w-full resize-none rounded-lg border border-[#D1D5DB] p-3 text-xs text-[#111827] outline-none focus:border-[#0C83FF] focus:ring-1 focus:ring-[#0C83FF] placeholder:text-[#9CA3AF]"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-3.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-xs font-medium text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#059669] text-xs font-medium text-white hover:bg-[#047857] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isPending ? (
                  <>
                    <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Completion</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
