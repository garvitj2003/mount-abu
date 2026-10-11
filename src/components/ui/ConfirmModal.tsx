"use client";

import { motion, AnimatePresence } from "motion/react";
import React from "react";

export type ConfirmVariant = "danger" | "warning" | "primary" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string | React.ReactNode;
  message?: string | React.ReactNode;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  message,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const content = description ?? message ?? "";
  const finalConfirmLabel = confirmLabel ?? confirmText ?? "Confirm";
  const finalCancelLabel = cancelLabel ?? cancelText ?? "Cancel";
  const variantStyles = {
    danger: {
      badgeBg: "bg-rose-50 text-rose-600 border-rose-200",
      buttonBg: "bg-[#DC2626] hover:bg-[#B91C1C] text-white border-transparent",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    warning: {
      badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
      buttonBg: "bg-[#D97706] hover:bg-[#B45309] text-white border-transparent",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    primary: {
      badgeBg: "bg-blue-50 text-[#0C83FF] border-blue-200",
      buttonBg: "bg-[#0C83FF] hover:bg-[#0070E0] text-white border-transparent",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      ),
    },
    success: {
      badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      buttonBg: "bg-[#059669] hover:bg-[#047857] text-white border-transparent",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-onest">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-xl flex flex-col border border-[#D6D9DE]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${variantStyles.badgeBg}`}>
                  {variantStyles.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#111827]">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors disabled:opacity-40"
                title="Close"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 text-xs leading-relaxed text-[#4B5563]">
              {typeof content === "string" ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="h-8 px-3.5 rounded-lg border border-[#D1D5DB] bg-white text-xs font-medium text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {finalCancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`h-8 px-4 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${variantStyles.buttonBg}`}
              >
                {isLoading ? (
                  <>
                    <div className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{finalConfirmLabel}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
