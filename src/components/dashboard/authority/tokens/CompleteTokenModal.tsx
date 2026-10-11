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
            className="absolute inset-0 bg-black/25 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F8FAFC] p-4 px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Image
                    src="/dashboard/icons/tick-round-green.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-[#1D1D1F]">
                    Complete Token & Phase {token.phase} {isFinalPhase && "(Final Phase)"}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    Token: <span className="font-semibold text-[#1D1D1F]">{token.token_number}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
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
            <div className="flex flex-col gap-4 p-6 max-h-[70vh] overflow-y-auto">
              {/* Notice banner */}
              {isFinalPhase ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 flex items-start gap-3">
                  <div className="mt-0.5 size-5 shrink-0 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="text-xs text-[#334155] leading-relaxed">
                    <p className="font-semibold text-[#0F172A] mb-0.5">
                      Final Phase of Application (Phase {currentPhase} of {totalPhases})
                    </p>
                    Marking this final phase token as completed will finalize vehicle material transit for this application. Any unused material quota will close and will not roll over further.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-100 bg-[#F0F7FF] p-3.5 flex items-start gap-3">
                  <div className="mt-0.5 size-5 shrink-0 rounded-full bg-[#0C83FF]/15 text-[#0C83FF] flex items-center justify-center text-xs font-bold">
                    ℹ
                  </div>
                  <div className="text-xs text-[#334155] leading-relaxed">
                    <p className="font-semibold text-[#0F172A] mb-0.5">
                      Automatic Material Rollover & Phase Unlocking
                    </p>
                    Any remaining / unused material quota in Phase {token.phase} will automatically roll over into <span className="font-semibold text-[#0C83FF]">Phase {nextPhase}</span>. Marking this token as completed will also unlock Phase {nextPhase} for token generation.
                  </div>
                </div>
              )}

              {/* Material Rollover Summary Table */}
              <div>
                <p className="text-xs font-semibold text-[#343434] uppercase tracking-wider mb-2">
                  Material Balance Breakdown
                </p>
                <div className="w-full overflow-hidden rounded-xl border border-[#D6D9DE] bg-white">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#D6D9DE] bg-[#F8FAFC]">
                        <th className="p-2.5 font-semibold text-[#64748B]">Material</th>
                        <th className="p-2.5 font-semibold text-[#64748B] text-right">Permitted</th>
                        <th className="p-2.5 font-semibold text-[#64748B] text-right">Consumed</th>
                        <th className="p-2.5 font-semibold text-right">
                          {isFinalPhase ? "Unused Quota" : `Rollover to Ph ${nextPhase}`}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {materials.map((m, idx) => {
                        const remaining = Number(m.remaining_quantity) || 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="p-2.5 font-medium text-[#1E293B]">
                              {m.material_name} <span className="text-[#64748B] font-normal">({m.unit})</span>
                            </td>
                            <td className="p-2.5 text-right text-[#475569]">{m.approved_quantity}</td>
                            <td className="p-2.5 text-right text-[#475569]">{m.consumed_quantity}</td>
                            <td className={`p-2.5 text-right font-semibold ${isFinalPhase ? "text-gray-500" : "text-emerald-600"}`}>
                              {remaining > 0 ? (isFinalPhase ? `${remaining} ${m.unit}` : `+${remaining} ${m.unit}`) : "0"}
                            </td>
                          </tr>
                        );
                      })}
                      {materials.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-xs text-[#94A3B8] italic">
                            No phase materials recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#343434]">
                  Remarks / Notes <span className="font-normal text-[#64748B]">(optional)</span>
                </label>
                <textarea
                  placeholder="e.g., Work finished ahead of schedule, leftover materials rolled over to next phase."
                  className="w-full h-[90px] resize-none rounded-xl border border-[#D6D9DE] p-3 text-xs text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-50"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-[#D6D9DE] p-4 px-6 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-[42px] rounded-xl border border-[#D6D9DE] bg-white text-xs font-semibold text-[#343434] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded-xl bg-[#059669] text-xs font-semibold text-white hover:bg-[#047857] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isPending ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Image
                    src="/dashboard/icons/tick-round-green.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="invert brightness-0"
                  />
                )}
                {isPending ? "Completing..." : "Confirm & Complete Token"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
