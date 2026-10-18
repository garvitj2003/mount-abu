"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { format, addDays } from "date-fns";
import { useAvailableSlots, useBookSchedule, useCancelSchedule } from "@/hooks/useSchedule";
import { useVehicleTypes } from "@/hooks/useMasterData";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { type VehicleScheduleResponse } from "@/services/scheduleService";

interface ScheduleVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
  tokenNumber: string;
  existingSchedule?: VehicleScheduleResponse | null;
  onSuccess?: () => void;
}

export default function ScheduleVehicleModal({
  isOpen,
  onClose,
  tokenId,
  tokenNumber,
  existingSchedule,
  onSuccess,
}: ScheduleVehicleModalProps) {
  const tomorrow = addDays(new Date(), 1);
  const tomorrowStr = format(tomorrow, "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleTypeId, setVehicleTypeId] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: slotsData, isLoading: isLoadingSlots } = useAvailableSlots(selectedDate, {
    enabled: isOpen && !existingSchedule,
  });
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const { mutate: bookSchedule, isPending: isBooking } = useBookSchedule();
  const { mutate: cancelSchedule, isPending: isCancelling } = useCancelSchedule();

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(tomorrowStr);
      setSelectedSlotId(null);
      setVehicleNumber("");
      setVehicleTypeId(undefined);
      setErrorMsg("");
      setShowCancelConfirm(false);
    }
  }, [isOpen, tomorrowStr]);

  const activeVehicleTypes = vehicleTypes.filter((v: any) => v.is_active);

  const handleVehicleNumberChange = (val: string) => {
    setVehicleNumber(val.toUpperCase());
  };

  const handleBook = () => {
    setErrorMsg("");
    if (!selectedSlotId) {
      setErrorMsg("Please select a time slot for transit.");
      return;
    }
    if (!vehicleNumber.trim()) {
      setErrorMsg("Please enter the vehicle registration number.");
      return;
    }

    bookSchedule(
      {
        token_id: tokenId,
        slot_id: selectedSlotId,
        schedule_date: selectedDate,
        vehicle_number: vehicleNumber.trim().toUpperCase(),
        vehicle_type_id: vehicleTypeId,
      },
      {
        onSuccess: () => {
          alert("Vehicle scheduled successfully! You can present the transport code at Naka.");
          onSuccess?.();
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.detail || "Failed to book vehicle schedule.");
        },
      }
    );
  };

  const handleCancel = () => {
    if (!existingSchedule) return;
    setShowCancelConfirm(true);
  };

  const executeCancel = () => {
    if (!existingSchedule) return;
    cancelSchedule(existingSchedule.id, {
      onSuccess: () => {
        alert("Vehicle schedule cancelled successfully.");
        setShowCancelConfirm(false);
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        alert(err.response?.data?.detail || "Failed to cancel schedule.");
      },
    });
  };

  // Generate next 7 days for Apple Calendar date strip starting from Tomorrow (T+1 basis)
  const dateStrip = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return {
      dateStr: format(d, "yyyy-MM-dd"),
      dayOfWeek: i === 0 ? "Tmrw" : format(d, "EEE"),
      dayNumber: format(d, "d"),
      monthStr: format(d, "MMM"),
    };
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div key="schedule-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-onest">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Card (Apple Sheet Presentation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl flex flex-col border border-black/[0.08]"
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/90 backdrop-blur-md px-6 py-4.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0C83FF]/10 text-[#0C83FF]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                    {existingSchedule ? "Transit Booking Pass" : "Schedule Transit Slot"}
                  </h2>
                  <p className="text-xs text-[#86868B]">
                    Token: <strong className="font-semibold text-[#0C83FF]">{tokenNumber}</strong>
                  </p>
                </div>
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

            {/* If an active schedule already exists (Apple Wallet Pass style) */}
            {existingSchedule ? (
              <div className="p-6 flex flex-col gap-4 bg-[#F8F9FA]">
                <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/80 to-white p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3.5 border-b border-blue-100">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Transit Pass</span>
                      <span className="text-sm font-bold text-[#1D1D1F] font-mono mt-0.5">{existingSchedule.schedule_code}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/90 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                      <span className="size-2 rounded-full bg-blue-500 animate-pulse" /> {existingSchedule.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[#86868B] font-medium">Scheduled Date</p>
                      <p className="text-[#1D1D1F] font-bold text-sm mt-0.5">
                        {format(new Date(existingSchedule.schedule_date), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#86868B] font-medium">Time Window</p>
                      <p className="text-[#1D1D1F] font-bold text-sm mt-0.5">
                        {existingSchedule.start_time && existingSchedule.end_time
                          ? `${existingSchedule.start_time} - ${existingSchedule.end_time}`
                          : existingSchedule.slot_name || "Assigned Slot"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#86868B] font-medium">Vehicle Registration</p>
                      <p className="text-[#1D1D1F] font-bold font-mono text-sm mt-0.5">
                        {existingSchedule.vehicle_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#86868B] font-medium">Vehicle Category</p>
                      <p className="text-[#1D1D1F] font-semibold mt-0.5">
                        {existingSchedule.vehicle_type_name || "Standard Transit Vehicle"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base">💡</span>
                  <p className="opacity-90 leading-relaxed">
                    Present your transit QR code at Mount Abu Naka Toll during this slot for verified entry. You can cancel this slot to reschedule.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="rounded-full px-5 py-2 text-xs font-medium text-[#515154] hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isCancelling && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    Cancel Booking
                  </button>
                </div>
              </div>
            ) : (
              /* Apple-style Booking Form */
              <div className="p-6 flex flex-col gap-5 bg-[#F8F9FA]">
                {errorMsg && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. Apple Calendar Date Strip */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1D1D1F]">
                      Select Transit Date <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-[#86868B]">T+1 Advance Window</span>

                  </div>

                  {/* Horizontal Apple Date Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {dateStrip.map((item) => {
                      const isSelected = selectedDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.dateStr);
                            setSelectedSlotId(null);
                          }}
                          className={`min-w-[62px] flex-1 rounded-2xl py-2.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-[#0C83FF] text-white shadow-md shadow-[#0C83FF]/30 scale-[1.03]"
                              : "bg-white border border-black/[0.06] text-[#515154] hover:border-black/[0.15] hover:bg-neutral-50"
                          }`}
                        >
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? "text-white/80" : "text-[#86868B]"}`}>
                            {item.dayOfWeek}
                          </span>
                          <span className="text-base font-bold tracking-tight">
                            {item.dayNumber}
                          </span>
                          <span className={`text-[10px] font-medium ${isSelected ? "text-white/90" : "text-[#86868B]"}`}>
                            {item.monthStr}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Blackout Date Alert */}
                {slotsData?.is_full_day_blackout && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-200/80 p-4 text-xs text-rose-800 flex items-start gap-3 shadow-sm">
                    <span className="text-lg">🚫</span>
                    <div>
                      <p className="font-bold">Blackout Date / Scheduled Holiday</p>
                      <p className="mt-0.5 opacity-90 leading-relaxed">
                        {slotsData.blackout_reason || "Vehicle transit scheduling is closed on this date."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Apple Watch / Widget Time Slot Selector */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1D1D1F]">
                      Choose Entry Window <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-[#86868B]">Arrival slots</span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white border border-black/[0.06]">
                      <div className="size-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent" />
                      <span className="text-[11px] text-[#86868B]">Checking slot capacity...</span>
                    </div>
                  ) : slotsData?.slots && slotsData.slots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-0.5">
                      {slotsData.slots.map((slot) => {
                        const isSelected = selectedSlotId === slot.slot_id;
                        const isFull = !slot.is_available;
                        const isBlackout = slot.is_blackout;
                        const isClosedToday = slot.is_applicable_today === false;

                        const isDisabled = isFull || isBlackout || isClosedToday;

                        return (
                          <div
                            key={slot.slot_id}
                            onClick={() => {
                              if (!isDisabled) setSelectedSlotId(slot.slot_id);
                            }}
                            className={`flex flex-col justify-between gap-2 rounded-2xl border p-3.5 transition-all duration-200 ${
                              isDisabled
                                ? "opacity-50 bg-neutral-100 border-neutral-200 cursor-not-allowed"
                                : isSelected
                                ? "border-[#0C83FF] bg-white ring-2 ring-[#0C83FF]/30 shadow-md cursor-pointer"
                                : "border-black/[0.06] bg-white hover:border-[#0C83FF]/50 hover:shadow-sm cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#1D1D1F]">{slot.name}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isBlackout
                                    ? "bg-neutral-200 text-neutral-700"
                                    : isClosedToday
                                    ? "bg-neutral-200 text-neutral-600"
                                    : isFull
                                    ? "bg-rose-100 text-rose-700"
                                    : slot.available_capacity <= 3
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {isBlackout
                                  ? "Blackout"
                                  : isClosedToday
                                  ? "Closed Today"
                                  : isFull
                                  ? "Full"
                                  : `${slot.available_capacity} left`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono text-xs font-semibold text-[#515154]">
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <span className="text-[10px] text-[#86868B]">
                                Cap: {slot.max_capacity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white p-6 text-center text-xs text-[#86868B]">
                      No available transit slots configured for this date.
                    </div>
                  )}
                </div>

                {/* 3. Grouped Vehicle Details */}
                <div className="rounded-2xl border border-black/[0.06] bg-white p-4.5 shadow-sm flex flex-col gap-3.5">
                  <span className="text-xs font-semibold text-[#1D1D1F]">Vehicle Details</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#515154]">
                        Vehicle Registration Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RJ 27 GA 1234"
                        value={vehicleNumber}
                        onChange={(e) => handleVehicleNumberChange(e.target.value)}
                        className="rounded-xl border border-black/[0.08] bg-neutral-50 px-3.5 py-2.5 text-xs font-mono font-bold uppercase text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#515154]">
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleTypeId || ""}
                        onChange={(e) => setVehicleTypeId(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="rounded-xl border border-black/[0.08] bg-neutral-50 px-3.5 py-2.5 text-xs text-[#1D1D1F] outline-none focus:border-[#0C83FF] focus:bg-white cursor-pointer"
                      >
                        <option value="">Select vehicle category</option>
                        {activeVehicleTypes.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>


                {/* Footer Buttons */}
                <div className="border-t border-black/[0.06] pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full px-5 py-2.5 text-xs font-medium text-[#515154] hover:bg-neutral-200/60 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={isBooking || !selectedSlotId || !vehicleNumber.trim()}
                    className="flex items-center gap-2 rounded-full bg-[#0C83FF] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0071E3] hover:shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isBooking && <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    Confirm Schedule
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Scheduled Slot"
        message="Are you sure you want to cancel this scheduled vehicle slot? You will need to select a new slot to transit."
        confirmText="Cancel Slot"
        cancelText="Keep Slot"
        variant="warning"
        isLoading={isCancelling}
        onConfirm={executeCancel}
        onClose={() => setShowCancelConfirm(false)}
      />
    </>
  );
}

