"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateBlackout, useUpdateBlackout, useSlots } from "@/hooks/useMasterData";
import { type ScheduleBlackoutResponse } from "@/services/masterDataService";
import { format } from "date-fns";

interface NewBlackoutDrawerProps {

  isOpen: boolean;
  onClose: () => void;
  data?: ScheduleBlackoutResponse | null;
}

export default function NewBlackoutDrawer({
  isOpen,
  onClose,
  data,
}: NewBlackoutDrawerProps) {
  const { mutate: createBlackout, isPending: isCreating } = useCreateBlackout();
  const { mutate: updateBlackout, isPending: isUpdating } = useUpdateBlackout();
  const { data: slots = [] } = useSlots();

  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    blackout_date: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    is_full_day: true,
    slot_id: "" as string | number,
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        blackout_date: data.blackout_date ? format(new Date(data.blackout_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        reason: data.reason,
        is_full_day: data.is_full_day,
        slot_id: data.slot_id ? data.slot_id.toString() : "",
        is_active: data.is_active,
      });
    } else {
      setFormData({
        blackout_date: format(new Date(), "yyyy-MM-dd"),
        reason: "",
        is_full_day: true,
        slot_id: "",
        is_active: true,
      });
    }
  }, [data, isOpen]);

  const handleSubmit = () => {
    if (!formData.blackout_date) {
      alert("Blackout Date is required");
      return;
    }
    if (!formData.reason.trim()) {
      alert("Reason for Blackout is required");
      return;
    }

    const payload = {
      blackout_date: formData.blackout_date,
      reason: formData.reason.trim(),
      is_full_day: formData.is_full_day,
      slot_id: formData.is_full_day || !formData.slot_id ? null : parseInt(formData.slot_id.toString()),
      is_active: formData.is_active,
    };

    if (isEdit && data) {
      updateBlackout(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            alert("Blackout entry updated successfully!");
            onClose();
          },
          onError: (err: any) => {
            alert(err.response?.data?.detail || "Failed to update blackout entry");
          },
        }
      );
    } else {
      createBlackout(payload, {
        onSuccess: () => {
          alert("Blackout entry created successfully!");
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to create blackout entry");
        },
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[480px] flex-col bg-white shadow-2xl font-onest border-l border-black/[0.06]"
          >
            {/* Apple Sheet Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/90 backdrop-blur-md px-6 py-4.5">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                  {isEdit ? "Edit Blackout / Holiday" : "New Blackout Override"}
                </h2>
                <p className="text-xs text-[#86868B]">
                  Block transit slots for holidays, VIP visits, or emergencies.
                </p>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-95 flex items-center justify-center text-[#515154] hover:text-[#1D1D1F] transition-all cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4L12 12M12 4L4 12" />
                </svg>
              </button>
            </div>

            {/* Apple Grouped Inset Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F8F9FA]">
              {/* Group 1: Date Selection */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1D1D1F]">
                    Blackout Date <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-[#86868B]">Calendar Day</span>
                </div>
                <input
                  type="date"
                  value={formData.blackout_date}
                  onChange={(e) => setFormData({ ...formData, blackout_date: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] bg-neutral-50/70 px-3.5 py-2.5 text-xs font-semibold font-mono text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white transition-all cursor-pointer"
                />
              </div>



              {/* Group 2: Reason */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#1D1D1F]">
                  Reason / Event Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mount Abu Summer Festival, Monsoon Maintenance"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] bg-neutral-50/50 px-3.5 py-2.5 text-xs text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white focus:ring-2 focus:ring-[#0C83FF]/10 transition-all"
                />
              </div>

              {/* Group 3: Scope (Apple Segmented Pill Switch) */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Blackout Scope</span>
                  <span className="text-[11px] font-medium text-[#86868B]">Closure range</span>
                </div>
                
                {/* Apple Segmented Control */}
                <div className="flex rounded-xl bg-neutral-100 p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_full_day: true, slot_id: "" })}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                      formData.is_full_day
                        ? "bg-white text-[#1D1D1F] shadow-sm"
                        : "text-[#86868B] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Full Day (All Slots)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_full_day: false })}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                      !formData.is_full_day
                        ? "bg-white text-[#1D1D1F] shadow-sm"
                        : "text-[#86868B] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Specific Slot Only
                  </button>
                </div>

                {/* Specific Slot Picker if partial */}
                {!formData.is_full_day && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <label className="text-xs font-medium text-[#515154]">
                      Select Restricted Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.slot_id}
                      onChange={(e) => setFormData({ ...formData, slot_id: e.target.value })}
                      className="rounded-xl border border-black/[0.08] bg-neutral-50 px-3.5 py-2.5 text-xs text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white"
                    >
                      <option value="">Select a slot...</option>
                      {slots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.start_time} - {s.end_time})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Group 4: Status Switch (Apple iOS Switch) */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Active Blackout</span>
                  <span className="text-[11px] text-[#86868B]">Enforce booking blockage immediately</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6.5 w-11.5 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    formData.is_active ? "bg-[#34C759]" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`inline-block size-5.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      formData.is_active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Apple Sheet Footer */}
            <div className="border-t border-black/[0.06] bg-white p-4.5 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full px-5 py-2 text-xs font-medium text-[#515154] hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-[#0C83FF] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0071E3] hover:shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {isEdit ? "Update Blackout" : "Create Blackout"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

