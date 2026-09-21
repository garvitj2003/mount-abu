"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateAnnouncement, useUpdateAnnouncement } from "@/hooks/useMasterData";
import { type AnnouncementResponse } from "@/services/masterDataService";
import { format } from "date-fns";

interface NewAnnouncementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: AnnouncementResponse | null;
}

export default function NewAnnouncementDrawer({
  isOpen,
  onClose,
  data,
}: NewAnnouncementDrawerProps) {
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement();

  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    valid_till: "",
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        message: data.message || "",
        valid_till: data.valid_till ? format(new Date(data.valid_till), "yyyy-MM-dd'T'HH:mm") : "",
        is_active: data.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        message: "",
        valid_till: "",
        is_active: true,
      });
    }
  }, [data, isOpen]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!formData.message.trim()) {
      alert("Message is required");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      valid_till: formData.valid_till ? new Date(formData.valid_till).toISOString() : null,
      is_active: formData.is_active,
    };

    if (isEdit && data) {
      updateAnnouncement(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            alert("Announcement updated successfully!");
            onClose();
          },
          onError: (err: any) => {
            alert(err.response?.data?.detail || "Failed to update announcement");
          },
        }
      );
    } else {
      createAnnouncement(payload, {
        onSuccess: () => {
          alert("Announcement created successfully!");
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to create announcement");
        },
      });
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
            className="relative z-10 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl font-onest"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                {isEdit ? "Edit Announcement" : "Create New Announcement"}
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-normal text-[#343434]">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Walk-in Service Notice"
                  className="w-full rounded-lg border border-[#D6D9DE] px-3.5 py-2.5 text-sm font-normal text-[#343434] outline-none focus:border-[#0C83FF]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-xs font-normal text-[#343434]">
                  Announcement Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Walk-in material transit service is closed. You must now schedule your vehicle entry through the portal before arrival."
                  className="w-full rounded-lg border border-[#D6D9DE] px-3.5 py-2.5 text-sm font-normal text-[#343434] outline-none focus:border-[#0C83FF] resize-none"
                />
              </div>

              {/* Valid Till */}
              <div>
                <label className="mb-2 block text-xs font-normal text-[#343434]">
                  Valid Till (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.valid_till}
                  onChange={(e) => setFormData({ ...formData, valid_till: e.target.value })}
                  className="w-full rounded-lg border border-[#D6D9DE] px-3.5 py-2.5 text-sm font-normal text-[#343434] outline-none focus:border-[#0C83FF]"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Leave empty if this announcement stays active until manually deactivated.
                </span>
              </div>

              {/* Is Active Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-sm font-medium text-[#343434] block">Active Status</span>
                  <span className="text-xs text-gray-500">Show this announcement to citizens</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0C83FF]"></div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <button
                onClick={onClose}
                disabled={isPending}
                className="cursor-pointer rounded-lg border border-[#D6D9DE] bg-white px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="cursor-pointer rounded-lg bg-[#0C83FF] px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving..." : isEdit ? "Update Announcement" : "Create Announcement"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
