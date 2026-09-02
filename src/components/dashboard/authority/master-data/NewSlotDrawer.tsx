"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCreateSlot, useUpdateSlot } from "@/hooks/useMasterData";
import { type SlotDefinitionResponse } from "@/services/masterDataService";

interface NewSlotDrawerProps {


  isOpen: boolean;
  onClose: () => void;
  data?: SlotDefinitionResponse | null;
}

export default function NewSlotDrawer({
  isOpen,
  onClose,
  data,
}: NewSlotDrawerProps) {
  const { mutate: createSlot, isPending: isCreating } = useCreateSlot();
  const { mutate: updateSlot, isPending: isUpdating } = useUpdateSlot();

  const isPending = isCreating || isUpdating;
  const isEdit = !!data;

  const [formData, setFormData] = useState({
    name: "",
    start_time: "08:00",
    end_time: "10:00",
    max_capacity: 20,
    applicable_days: "MON,TUE,WED,THU,FRI,SAT,SUN",
    grace_period_minutes: 30,
    is_active: true,
  });

  const DAYS = [
    { key: "MON", label: "Mon" },
    { key: "TUE", label: "Tue" },
    { key: "WED", label: "Wed" },
    { key: "THU", label: "Thu" },
    { key: "FRI", label: "Fri" },
    { key: "SAT", label: "Sat" },
    { key: "SUN", label: "Sun" },
  ];

  const toggleDay = (dayKey: string) => {
    const current = (formData.applicable_days || "").split(",").map(d => d.trim()).filter(Boolean);
    let updated: string[];
    if (current.includes(dayKey)) {
      updated = current.filter(d => d !== dayKey);
    } else {
      updated = [...current, dayKey];
    }
    setFormData({ ...formData, applicable_days: updated.join(",") });
  };

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        start_time: data.start_time,
        end_time: data.end_time,
        max_capacity: data.max_capacity,
        applicable_days: data.applicable_days || "MON,TUE,WED,THU,FRI,SAT,SUN",
        grace_period_minutes: data.grace_period_minutes ?? 30,
        is_active: data.is_active,
      });
    } else {
      setFormData({
        name: "",
        start_time: "08:00",
        end_time: "10:00",
        max_capacity: 20,
        applicable_days: "MON,TUE,WED,THU,FRI,SAT,SUN",
        grace_period_minutes: 30,
        is_active: true,
      });
    }
  }, [data, isOpen]);


  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Slot Name is required");
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      alert("Start time and end time are required");
      return;
    }
    if (formData.max_capacity < 1) {
      alert("Max vehicle capacity must be at least 1");
      return;
    }

    const payload = { ...formData, name: formData.name.trim() };

    if (isEdit && data) {
      updateSlot(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            alert("Slot updated successfully!");
            onClose();
          },
          onError: (err: any) => {
            alert(err.response?.data?.detail || "Failed to update slot");
          },
        }
      );
    } else {
      createSlot(payload, {
        onSuccess: () => {
          alert("Slot created successfully!");
          onClose();
          setFormData({
            name: "",
            start_time: "08:00",
            end_time: "10:00",
            max_capacity: 20,
            applicable_days: "MON,TUE,WED,THU,FRI,SAT,SUN",
            grace_period_minutes: 30,
            is_active: true,
          });

        },
        onError: (err: any) => {
          alert(err.response?.data?.detail || "Failed to create slot");
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
                  {isEdit ? "Edit Transit Slot" : "New Transit Slot"}
                </h2>
                <p className="text-xs text-[#86868B]">
                  Define daily operational window & capacity limits.
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
              {/* Group 1: General Info */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1D1D1F]">
                    Slot Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Morning Slot 1 (08:00 - 10:00)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-neutral-50/50 px-3.5 py-2.5 text-xs text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white focus:ring-2 focus:ring-[#0C83FF]/10 transition-all"
                  />
                </div>
              </div>

              {/* Group 2: Time Window */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Operating Time Window</span>
                  <span className="text-[11px] font-medium text-[#86868B]">Daily Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 rounded-xl bg-neutral-50/70 border border-black/[0.06] p-3">
                    <span className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">Start Time</span>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full border-none bg-transparent p-0 text-sm font-semibold font-mono text-[#1D1D1F] outline-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 rounded-xl bg-neutral-50/70 border border-black/[0.06] p-3">
                    <span className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">End Time</span>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full border-none bg-transparent p-0 text-sm font-semibold font-mono text-[#1D1D1F] outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>




              {/* Group 3: Operational Days (Apple Circular Day Chips) */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Operational Days</span>
                  <span className="text-[11px] font-medium text-[#86868B]">Repeats weekly</span>
                </div>
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {DAYS.map((d) => {
                    const isSelected = (formData.applicable_days || "").split(",").map(s => s.trim()).includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => toggleDay(d.key)}
                        className={`size-10 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-[#0C83FF] text-white shadow-md shadow-[#0C83FF]/25 scale-105"
                            : "bg-neutral-100 text-[#515154] hover:bg-neutral-200/80"
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#86868B] pt-0.5">
                  Transit will only be open for citizen bookings on highlighted days.
                </p>
              </div>

              {/* Group 4: Capacity & Grace Window (Apple Stepper style) */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-5">
                {/* Max Capacity */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#1D1D1F]">Daily Vehicle Capacity</span>
                    <span className="text-[11px] text-[#86868B]">Max slots allowed per day</span>
                  </div>
                  {/* Apple Stepper Control below text */}
                  <div className="flex items-center justify-between rounded-xl bg-neutral-100/80 p-1 border border-black/[0.05]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, max_capacity: Math.max(1, formData.max_capacity - 1) })}
                      className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-[#1D1D1F] hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="3" y1="8" x2="13" y2="8" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1 font-bold text-sm text-[#1D1D1F]">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={formData.max_capacity}
                        onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 1 })}
                        className="w-14 text-center bg-transparent font-bold text-sm text-[#1D1D1F] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs font-medium text-[#86868B]">Vehicles</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, max_capacity: formData.max_capacity + 1 })}
                      className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-[#1D1D1F] hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="8" y1="3" x2="8" y2="13" />
                        <line x1="3" y1="8" x2="13" y2="8" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="h-px bg-black/[0.05]" />

                {/* Arrival Grace Period (±5 min steps) */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#1D1D1F]">Arrival Grace Period</span>
                    <span className="text-[11px] text-[#86868B]">Tolerance before marked mismatch (±5 mins per step)</span>
                  </div>
                  {/* Apple Stepper Control below text */}
                  <div className="flex items-center justify-between rounded-xl bg-neutral-100/80 p-1 border border-black/[0.05]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, grace_period_minutes: Math.max(0, formData.grace_period_minutes - 5) })}
                      className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-[#1D1D1F] hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="3" y1="8" x2="13" y2="8" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1 font-bold text-sm text-[#1D1D1F]">
                      <span className="text-xs text-[#86868B]">±</span>
                      <input
                        type="number"
                        min={0}
                        max={180}
                        step={5}
                        value={formData.grace_period_minutes}
                        onChange={(e) => setFormData({ ...formData, grace_period_minutes: parseInt(e.target.value) || 0 })}
                        className="w-12 text-center bg-transparent font-bold text-sm text-[#1D1D1F] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs font-medium text-[#86868B]">mins</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, grace_period_minutes: formData.grace_period_minutes + 5 })}
                      className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-bold text-[#1D1D1F] hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="8" y1="3" x2="8" y2="13" />
                        <line x1="3" y1="8" x2="13" y2="8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>


              {/* Group 5: Active Status Switch (Apple iOS Toggle) */}
              <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Enable Slot</span>
                  <span className="text-[11px] text-[#86868B]">Active for citizens and authorities</span>
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
                {isEdit ? "Update Slot" : "Create Slot"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

}
