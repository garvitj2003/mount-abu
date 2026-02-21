"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useChangePassword } from "@/hooks/useUser";
import { type components } from "@/types/api";

type UserResponse = components["schemas"]["UserResponse"];

interface ResetPasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export default function ResetPasswordDrawer({ isOpen, onClose, user }: ResetPasswordDrawerProps) {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!user) return;

    try {
      await changePassword({ user_id: user.id, new_password: newPassword });
      alert("Password updated successfully!");
      onClose();
    } catch (err: any) {
      console.error("Failed to reset password", err);
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to reset password");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
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
                Reset Password
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
              
              {/* User Info Read-only */}
              <div className="space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="text-sm font-medium text-[#343434]">{user.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Username</span>
                    <span className="text-sm font-medium text-[#343434]">{user.username || "—"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-sm font-medium text-[#343434]">{user.role}</span>
                </div>
              </div>

              {/* New Password Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">New Password</label>
                <input 
                  type="password"
                  placeholder="Enter new password"
                  className={`w-full h-[44px] rounded-lg border ${error ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40`}
                  value={newPassword}
                  onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError(null);
                  }}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <p className="text-xs text-gray-500">Minimum 6 characters required.</p>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[44px] rounded-lg border border-[#D6D9DE] bg-white px-6 text-sm font-medium text-[#343434] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#8E70C1] px-8 text-sm font-medium text-white hover:bg-[#7a5eb0] transition-colors disabled:opacity-50"
              >
                {isPending ? "Updating..." : "Update Password"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
