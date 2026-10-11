"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";

type TokenDetailResponse = components["schemas"]["TokenDetailResponse"];

interface ExtendTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  token: TokenDetailResponse;
  isPending?: boolean;
}

export default function ExtendTokenModal({
  isOpen,
  onClose,
  onConfirm,
  token,
  isPending = false,
}: ExtendTokenModalProps) {
  const [remarks, setRemarks] = useState("");

  const isExpired =
    token.status === "EXPIRED" ||
    (token.valid_till ? new Date(token.valid_till).getTime() < Date.now() : false);

  const currentValidTill = token.valid_till ? new Date(token.valid_till) : null;
  const newValidTill = isExpired
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : currentValidTill
    ? new Date(currentValidTill.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
            className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-xl font-onest flex flex-col border border-[#D6D9DE]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111827]">
                  {isExpired ? "Revive & Extend Token (+30 Days)" : "Extend Token Validity (+30 Days)"}
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
            <div className="flex flex-col gap-4 p-6">
              {/* Notice Banner */}
              <div className={`rounded-lg border p-3.5 ${isExpired ? "border-rose-200 bg-rose-50/70" : "border-amber-200 bg-amber-50/70"}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 shrink-0 ${isExpired ? "text-rose-600" : "text-amber-600"}`}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M8 5.33333V8.66667M8 11.3333H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={`text-xs leading-relaxed ${isExpired ? "text-rose-900" : "text-amber-900"}`}>
                    <span className={`font-semibold uppercase tracking-wider text-[11px] block mb-0.5 ${isExpired ? "text-rose-800" : "text-amber-800"}`}>
                      {isExpired ? "Expired Token Revival" : "Validity Extension Provision"}
                    </span>
                    {isExpired
                      ? "This token has expired. Confirming this action will reactivate the token status to ACTIVE and grant 30 days validity from today."
                      : "This token is expiring within the next 15 days. Confirming this action will extend token validity by exactly one month (+30 days) from its current expiry date."}
                  </div>
                </div>
              </div>

              {/* Validity Details Card */}
              <div className="rounded-lg border border-[#E5E7EB] bg-gray-50/60 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{isExpired ? "Expired On:" : "Current Expiry:"}</span>
                  <span className={`text-xs font-semibold ${isExpired ? "text-rose-600" : "text-[#111827]"}`}>
                    {formatDate(currentValidTill)}
                  </span>
                </div>
                <div className="h-px w-full bg-[#E5E7EB]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#059669] font-medium">{isExpired ? "New Expiry (Today + 30 Days):" : "New Expiry (+30 Days):"}</span>
                  <span className="text-xs font-bold text-[#059669]">
                    {formatDate(newValidTill)}
                  </span>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#374151]">
                  Official Remarks / Justification <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Validity extended on applicant request due to inclement weather conditions"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#D1D5DB] p-2.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C83FF] focus:outline-none focus:ring-1 focus:ring-[#0C83FF]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] bg-gray-50/50 px-6 py-3.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-medium text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-[#0C83FF] bg-[#0C83FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0070E0] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isPending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Extending...</span>
                  </>
                ) : (
                  <span>Confirm +30 Days Extension</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
