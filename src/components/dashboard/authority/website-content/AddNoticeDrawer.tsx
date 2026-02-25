"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { useCreateNotice } from "@/hooks/useWebsiteContent";

type NoticeCreate = components["schemas"]["NoticeCreate"];
type NoticeStatus = components["schemas"]["NoticeStatus"];
type Visibility = components["schemas"]["Visibility"];

interface AddNoticeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTICE_TYPE_OPTIONS = [
  { label: "Public Notice", value: "Public Notice" },
  { label: "Circular", value: "Circular" },
  { label: "Traffic Advisory", value: "Traffic Advisory" },
  { label: "Public Information", value: "Public Information" },
  { label: "Internal Notice", value: "Internal Notice" },
];

export default function AddNoticeDrawer({ isOpen, onClose }: AddNoticeDrawerProps) {
  const { mutateAsync: createNotice, isPending } = useCreateNotice();
  
  const [formData, setFormData] = useState<NoticeCreate>({
    title: "",
    notice_type: "Public Notice",
    published_on: new Date().toISOString(),
    valid_till: null,
    status: "ACTIVE",
    visibility: "PUBLIC",
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a notice title");
      return;
    }
    
    try {
      await createNotice(formData);
      onClose();
      // Reset form
      setFormData({
        title: "",
        notice_type: "Public Notice",
        published_on: new Date().toISOString(),
        valid_till: null,
        status: "ACTIVE",
        visibility: "PUBLIC",
      });
      alert("Notice added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add notice");
    }
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
                Add New Notice
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
              
              {/* Notice Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Notice Title</label>
                <input 
                  type="text"
                  placeholder="Revised Building Permission Guidelines"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Notice Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Notice Type</label>
                <DropdownSelect
                  options={NOTICE_TYPE_OPTIONS}
                  value={formData.notice_type || ""}
                  onChange={(val) => setFormData({ ...formData, notice_type: val as string })}
                  className="w-full h-[44px]"
                />
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#343434]">Visibility</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="visibility" 
                      className="hidden"
                      checked={formData.visibility === "PUBLIC"}
                      onChange={() => setFormData({ ...formData, visibility: "PUBLIC" })}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.visibility === "PUBLIC" ? "border-[#0C83FF]" : "border-[#D6D9DE]"}`}>
                      {formData.visibility === "PUBLIC" && <div className="w-2.5 h-2.5 rounded-full bg-[#0C83FF]" />}
                    </div>
                    <span className="text-[13px] text-[#343434] font-normal">Public (Visible on website)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="visibility" 
                      className="hidden"
                      checked={formData.visibility === "INTERNAL"}
                      onChange={() => setFormData({ ...formData, visibility: "INTERNAL" })}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.visibility === "INTERNAL" ? "border-[#0C83FF]" : "border-[#D6D9DE]"}`}>
                      {formData.visibility === "INTERNAL" && <div className="w-2.5 h-2.5 rounded-full bg-[#0C83FF]" />}
                    </div>
                    <span className="text-[13px] text-[#343434] font-normal">Internal (Dashboard only)</span>
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Publish Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.published_on?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, published_on: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Valid Till</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] pr-10"
                      value={formData.valid_till?.split('T')[0] || ""}
                      onChange={(e) => setFormData({ ...formData, valid_till: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive notices will not be visible.</p>
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
                disabled={isPending}
                className="h-[44px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add Notice"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
