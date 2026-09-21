"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserService } from "@/services/userService";
import { format, parseISO } from "date-fns";

interface ClearMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCreateAuthority?: (mobile: string) => void;
}

interface UserPreview {
  user_id: number;
  name?: string | null;
  mobile: string;
  role: string;
  is_active: boolean;
  created_at?: string | null;
  applications_count: number;
  complaints_count: number;
  tokens_count: number;
  schedules_count: number;
  has_active_data: boolean;
}

type Step = "INSPECT" | "OTP" | "SUCCESS";

export default function ClearMobileModal({
  isOpen,
  onClose,
  onSuccessCreateAuthority,
}: ClearMobileModalProps) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("INSPECT");
  const [userPreview, setUserPreview] = useState<UserPreview | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedWarning, setConfirmedWarning] = useState(false);

  const resetState = () => {
    setMobile("");
    setOtp("");
    setStep("INSPECT");
    setUserPreview(null);
    setIsInspecting(false);
    setIsSendingOtp(false);
    setIsDeleting(false);
    setErrorMsg("");
    setConfirmedWarning(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleInspect = async () => {
    setErrorMsg("");
    setUserPreview(null);
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setIsInspecting(true);
      const data = await UserService.checkMobile(cleaned);
      setUserPreview(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setErrorMsg(`No account found with mobile number +91 ${cleaned}. This number is already free and can be registered as an Authority directly.`);
      } else {
        setErrorMsg(err.response?.data?.detail || "Failed to inspect mobile number.");
      }
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSendOtp = async () => {
    setErrorMsg("");
    if (!userPreview) return;

    try {
      setIsSendingOtp(true);
      await UserService.sendClearOTP(userPreview.mobile);
      setStep("OTP");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to send verification OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    setErrorMsg("");
    if (!userPreview) return;
    if (otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP.");
      return;
    }
    if (userPreview.has_active_data && !confirmedWarning) {
      setErrorMsg("Please check the confirmation box acknowledging data deletion.");
      return;
    }

    try {
      setIsDeleting(true);
      await UserService.verifyAndDeleteUser(userPreview.mobile, otp.trim());
      setStep("SUCCESS");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Invalid OTP or deletion failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-onest">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col border border-black/[0.08]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-6 py-4.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="18" y1="8" x2="23" y2="13"></line>
                    <line x1="23" y1="8" x2="18" y2="13"></line>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1D1D1F]">
                    Clear / Unlink Registered Mobile
                  </h2>
                  <p className="text-xs text-[#86868B]">
                    Delete accidental citizen accounts via OTP verification to free up the number.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="size-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center text-[#515154] hover:text-[#1D1D1F] transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-[#F8F9FA] flex flex-col gap-4">
              {errorMsg && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
                  <span className="text-base leading-none">⚠️</span>
                  <span className="leading-relaxed font-medium">{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: INSPECT */}
              {step === "INSPECT" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-white border border-black/[0.06] p-4.5 shadow-sm flex flex-col gap-3">
                    <label className="text-xs font-semibold text-[#1D1D1F]">
                      Enter Mobile Number to Clear
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 rounded-xl border border-black/[0.08] bg-neutral-50 px-3.5 py-2.5 focus-within:border-[#0C83FF] focus-within:bg-white transition-all">
                        <span className="text-xs font-bold text-neutral-400 font-mono">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                          className="w-full border-none bg-transparent p-0 text-xs font-mono font-bold text-[#1D1D1F] outline-none placeholder:font-normal placeholder:text-neutral-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleInspect}
                        disabled={isInspecting || mobile.length !== 10}
                        className="rounded-xl bg-[#1D1D1F] hover:bg-black text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {isInspecting ? (
                          <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <span>Inspect</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Found Preview Card */}
                  {userPreview && (
                    <div className="rounded-2xl bg-white border border-black/[0.06] p-5 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between pb-3 border-b border-black/[0.05]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Account Found</span>
                          <h3 className="text-base font-bold text-[#1D1D1F] mt-0.5">
                            {userPreview.name || "Citizen Account"}
                          </h3>
                          <p className="text-xs font-mono text-neutral-500 mt-0.5">+91 {userPreview.mobile}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#0C83FF]">
                          {userPreview.role}
                        </span>
                      </div>

                      {/* Associated Data Grid */}
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        <div className="rounded-xl bg-neutral-50 p-2.5 border border-black/[0.04]">
                          <p className="text-[10px] font-medium text-[#86868B] uppercase">Applications</p>
                          <p className="text-lg font-bold text-[#1D1D1F] mt-0.5">{userPreview.applications_count}</p>
                        </div>
                        <div className="rounded-xl bg-neutral-50 p-2.5 border border-black/[0.04]">
                          <p className="text-[10px] font-medium text-[#86868B] uppercase">Complaints</p>
                          <p className="text-lg font-bold text-[#1D1D1F] mt-0.5">{userPreview.complaints_count}</p>
                        </div>
                        <div className="rounded-xl bg-neutral-50 p-2.5 border border-black/[0.04]">
                          <p className="text-[10px] font-medium text-[#86868B] uppercase">Tokens / Slots</p>
                          <p className="text-lg font-bold text-[#1D1D1F] mt-0.5">
                            {userPreview.tokens_count + userPreview.schedules_count}
                          </p>
                        </div>
                      </div>

                      {/* Warning Notice if active data exists */}
                      {userPreview.has_active_data ? (
                        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
                          <span className="text-base">🚨</span>
                          <p className="leading-relaxed">
                            <strong>Permanent Data Deletion Warning:</strong> This account has active records ({userPreview.applications_count} applications, {userPreview.complaints_count} complaints). Proceeding will <strong>permanently delete</strong> this account and all its submitted records to release the mobile number.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                          <span>✅</span>
                          <p>This is an accidental empty login with no submitted records. Safe to clear.</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white py-3 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingOtp && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                        <span>Send Verification OTP to +91 {userPreview.mobile} →</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === "OTP" && userPreview && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-white border border-black/[0.06] p-5 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#1D1D1F]">
                        Enter 6-Digit Verification OTP
                      </span>
                      <p className="text-xs text-[#86868B]">
                        A verification code has been sent via SMS to <strong className="text-[#1D1D1F] font-mono">+91 {userPreview.mobile}</strong>.
                      </p>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="rounded-xl border border-black/[0.1] bg-neutral-50 px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-[#1D1D1F] outline-none focus:border-rose-500 focus:bg-white transition-all"
                    />

                    {userPreview.has_active_data && (
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmedWarning}
                          onChange={(e) => setConfirmedWarning(e.target.checked)}
                          className="mt-0.5 size-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span className="leading-tight">
                          I confirm that I want to permanently delete this user account and all {userPreview.applications_count} associated applications/records.
                        </span>
                      </label>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep("INSPECT")}
                        className="rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#515154] py-2.5 px-4 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyAndDelete}
                        disabled={isDeleting || otp.length !== 6 || (userPreview.has_active_data && !confirmedWarning)}
                        className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white py-2.5 px-4 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                        <span>Verify & Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS */}
              {step === "SUCCESS" && userPreview && (
                <div className="rounded-2xl bg-white border border-black/[0.06] p-6 shadow-sm flex flex-col items-center gap-4 text-center">
                  <div className="size-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-[#1D1D1F]">
                      Account Deleted & Mobile Cleared!
                    </h3>
                    <p className="text-xs text-[#86868B] max-w-sm leading-relaxed">
                      Mobile number <strong className="font-mono text-[#1D1D1F]">+91 {userPreview.mobile}</strong> has been completely released and is now ready for Authority registration.
                    </p>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    {onSuccessCreateAuthority ? (
                      <button
                        type="button"
                        onClick={() => {
                          const mob = userPreview.mobile;
                          handleClose();
                          onSuccessCreateAuthority(mob);
                        }}
                        className="w-full flex-1 rounded-xl bg-[#0C83FF] hover:bg-blue-600 text-white py-3 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        Create Authority User with this Number →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full flex-1 rounded-xl bg-[#1D1D1F] text-white py-3 text-xs font-bold shadow-sm hover:bg-black transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step !== "SUCCESS" && (
              <div className="border-t border-black/[0.06] bg-white px-6 py-3.5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full px-5 py-2 text-xs font-medium text-[#515154] hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
