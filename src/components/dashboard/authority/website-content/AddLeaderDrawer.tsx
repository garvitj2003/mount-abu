"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";
import { useCreateLeader, useUpdateLeader } from "@/hooks/useWebsiteContent";

type LeaderCreate = components["schemas"]["Body_create_leader_api_leaders_post"];
type LeaderUpdate = components["schemas"]["LeaderUpdate"];
type LeaderResponse = components["schemas"]["LeaderResponse"];

interface AddLeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: LeaderResponse | null;
}

export default function AddLeaderDrawer({ isOpen, onClose, data }: AddLeaderDrawerProps) {
  const { mutateAsync: createLeader, isPending: isCreating } = useCreateLeader();
  const { mutateAsync: updateLeader, isPending: isUpdating } = useUpdateLeader();
  
  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState<LeaderCreate>({
    name: "",
    designation: "",
    tenure_start: null,
    tenure_end: null,
    status: "ACTIVE",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        designation: data.designation || "",
        tenure_start: data.tenure_start,
        tenure_end: data.tenure_end,
        status: data.status,
      });
    } else {
      setFormData({
        name: "",
        designation: "",
        tenure_start: null,
        tenure_end: null,
        status: "ACTIVE",
      });
    }
    setImageFile(null);
  }, [data, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    
    try {
      if (isEdit && data) {
        const updateData: LeaderUpdate = {
          name: formData.name,
          designation: formData.designation,
          tenure_start: formData.tenure_start,
          tenure_end: formData.tenure_end,
          status: formData.status,
        };
        await updateLeader({ id: data.id, data: updateData });
        alert("Leader updated successfully!");
      } else {
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("designation", formData.designation || "");
        if (formData.tenure_start) payload.append("tenure_start", formData.tenure_start);
        if (formData.tenure_end) payload.append("tenure_end", formData.tenure_end);
        payload.append("status", formData.status || "ACTIVE");
        if (imageFile) {
          payload.append("image", imageFile);
        }

        await createLeader(payload);
        alert("Leader added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEdit ? "update" : "add"} leader`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                {isEdit ? "Edit Leader" : "Add New Leader"}
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

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Full Name</label>
                <input 
                  type="text"
                  placeholder="Shri. Rajesh Kumar"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Designation</label>
                <input 
                  type="text"
                  placeholder="Commissioner / Chairman"
                  className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] placeholder:opacity-40"
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Tenure Start</label>
                  <input 
                    type="date"
                    className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                    value={formData.tenure_start?.split('T')[0] || ""}
                    onChange={(e) => setFormData({ ...formData, tenure_start: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Tenure End</label>
                  <input 
                    type="date"
                    className="w-full h-[44px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF]"
                    value={formData.tenure_end?.split('T')[0] || ""}
                    onChange={(e) => setFormData({ ...formData, tenure_end: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              {!isEdit && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">Leader Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#D6D9DE] bg-[#F5F6F7] p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/dashboard/icons/attach.svg" alt="attach" width={20} height={20} />
                      <span className="text-sm text-[#343434] opacity-60">
                        {imageFile ? imageFile.name : "Attach Image"}
                      </span>
                    </div>
                    {imageFile && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#343434]">Status</p>
                  <p className="text-[11px] text-[#343434] opacity-60">Inactive leaders will be shown in history.</p>
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
                {isPending ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Leader" : "Add Leader")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
