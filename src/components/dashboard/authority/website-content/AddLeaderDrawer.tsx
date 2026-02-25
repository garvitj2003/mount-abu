"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";

type LeaderCreate = components["schemas"]["LeaderCreate"];
type NoticeStatus = components["schemas"]["NoticeStatus"];

interface AddLeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (leader: LeaderCreate, file: File | null) => void;
}

export default function AddLeaderDrawer({ isOpen, onClose, onAdd }: AddLeaderDrawerProps) {
  const [formData, setFormData] = useState<LeaderCreate & { message: string }>({
    name: "",
    designation: "",
    tenure_start: new Date().toISOString().split('T')[0],
    tenure_end: "",
    status: "ACTIVE",
    message: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter leader's name");
      return;
    }
    onAdd?.(formData, selectedFile);
    onClose();
    // Reset form
    setFormData({
      name: "",
      designation: "",
      tenure_start: new Date().toISOString().split('T')[0],
      tenure_end: "",
      status: "ACTIVE",
      message: "",
    });
    setSelectedFile(null);
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
                Add New Leader
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
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Full Name</label>
                <input 
                  type="text"
                  placeholder="Shri Ramesh Kumar"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Designation</label>
                <input 
                  type="text"
                  placeholder="Chairman, Nagar Parishad"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>

              {/* Tenure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Tenure From</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                      value={formData.tenure_start?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, tenure_start: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Tenure To</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                      value={formData.tenure_end?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, tenure_end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Brief Profile / Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Brief Profile / Message</label>
                <textarea 
                  placeholder="Short profile or public message"
                  className="w-full h-[120px] resize-none rounded-lg border border-[#D6D9DE] p-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Profile Photo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Profile Photo</label>
                <div className="bg-white border-2 border-[#D6D9DE] border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3">
                  <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="Upload" width={36} height={36} className="opacity-60" />
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-[#343434]">Choose a file or drag & drop it here.</p>
                    <p className="text-[11px] text-[#343434] opacity-60 mt-0.5">JPG / PNG format</p>
                  </div>
                  <label className="mt-1 cursor-pointer bg-[#F5F6F7] border border-[#D6D9DE] rounded-lg px-4 py-2 text-xs font-medium text-[#343434] hover:bg-gray-200 transition-colors">
                    Browse File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {selectedFile && (
                    <p className="text-[11px] font-medium text-[#0C83FF] mt-1">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive categories cannot be selected by citizens.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.status === "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "ACTIVE" : "INACTIVE" })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0C83FF]"></div>
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button 
                onClick={onClose}
                className="h-[44px] rounded-lg border border-[#D6D9DE] bg-white px-6 text-sm font-medium text-[#343434] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleSubmit}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Save Leader
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
