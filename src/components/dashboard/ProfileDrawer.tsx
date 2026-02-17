"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@/hooks/useUser";
import { useWards } from "@/hooks/useMasterData";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
}: ProfileDrawerProps) {
  const { data: user } = useUser();
  const { data: wards = [] } = useWards();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    ward_id: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: "", // User schema doesn't have email yet, but design does
        mobile: user.mobile || "",
        ward_id: 0,
      });
    }
  }, [user]);

  const handleSave = () => {
    // Logic for saving profile will go here
    alert("Profile features are coming soon!");
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
                My Profile
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
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Name</label>
                <input 
                  type="text"
                  placeholder="Enter your name"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Email Address</label>
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[38px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Contact Number</label>
                <div className="flex h-[38px] w-full items-center rounded-lg border border-[#D6D9DE] bg-[#F0F0F0] px-3 text-sm text-[#343434]">
                  +91-{formData.mobile || "—"}
                </div>
              </div>

              {/* Choose Ward */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Choose Ward</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select 
                      className="w-full h-[38px] appearance-none rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] bg-white"
                      value={formData.ward_id || ""}
                      onChange={(e) => setFormData({ ...formData, ward_id: Number(e.target.value) })}
                    >
                      <option value="">List of wards goes here</option>
                      {wards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} />
                    </div>
                  </div>
                  <button className="h-[38px] whitespace-nowrap rounded-lg border border-[#0C83FF] bg-[#E7F3FF] px-4 text-xs font-medium text-[#0C83FF] hover:bg-[#D6E9FF] transition-colors">
                    Know Your Ward
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleSave}
                className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
