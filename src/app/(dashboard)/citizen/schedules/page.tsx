"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { useMySchedules, useCancelSchedule } from "@/hooks/useSchedule";
import { useTokens } from "@/hooks/useTokens";
import { useUser } from "@/hooks/useUser";
import { TokenService } from "@/services/tokenService";
import ScheduleVehicleModal from "@/components/dashboard/citizen/tokens/ScheduleVehicleModal";
import DumpingWarningModal from "@/components/dashboard/citizen/tokens/DumpingWarningModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { VehicleEntryService } from "@/services/vehicleEntryService";
import { type VehicleScheduleResponse } from "@/services/scheduleService";

type FilterStatus = "ALL" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

export default function CitizenSchedulesPage() {
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewPassSchedule, setViewPassSchedule] = useState<VehicleScheduleResponse | null>(null);
  const [cancelScheduleTarget, setCancelScheduleTarget] = useState<VehicleScheduleResponse | null>(null);

  // Direct Token Picker Modal & Scheduling Modal States
  const [isTokenPickerOpen, setIsTokenPickerOpen] = useState(false);
  const [resolvingTransportCode, setResolvingTransportCode] = useState<string | null>(null);
  const [selectedTokenForSchedule, setSelectedTokenForSchedule] = useState<{
    tokenId: number;
    tokenNumber: string;
  } | null>(null);
  const [showDumpingWarning, setShowDumpingWarning] = useState(false);
  const [pendingWarningToken, setPendingWarningToken] = useState<{
    tokenId: number;
    tokenNumber: string;
    vehicleNumber?: string | null;
    entryDate?: string | Date | null;
  } | null>(null);

  const { data: user } = useUser();
  const { data: schedules = [], isLoading, refetch } = useMySchedules();
  const { mutate: cancelSchedule, isPending: isCancelling } = useCancelSchedule();

  // Query active tokens for the direct picker
  const { data: tokensData, isLoading: isLoadingTokens, refetch: refetchTokens } = useTokens({
    status: "ACTIVE",
    limit: 50,
    citizen_user_id: user?.user_id,
  });
  const activeTokens = tokensData?.items || [];

  // Compute counts
  const counts = useMemo(() => {
    return {
      all: schedules.length,
      scheduled: schedules.filter((s) => s.status === "SCHEDULED").length,
      completed: schedules.filter((s) => s.status === "COMPLETED").length,
      cancelled: schedules.filter((s) => s.status === "CANCELLED" || s.status === "EXPIRED").length,
    };
  }, [schedules]);

  // Active schedules for prominent card presentation
  const activeSchedules = useMemo(() => {
    return schedules.filter((s) => s.status === "SCHEDULED");
  }, [schedules]);

  // Filtered schedules for list/table
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // Status filter
      if (selectedStatus === "SCHEDULED" && s.status !== "SCHEDULED") return false;
      if (selectedStatus === "COMPLETED" && s.status !== "COMPLETED") return false;
      if (selectedStatus === "CANCELLED" && s.status !== "CANCELLED" && s.status !== "EXPIRED") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesVehicle = s.vehicle_number?.toLowerCase().includes(q);
        const matchesCode = s.schedule_code?.toLowerCase().includes(q);
        const matchesSlot = s.slot_name?.toLowerCase().includes(q);
        const matchesType = s.vehicle_type_name?.toLowerCase().includes(q);
        if (!matchesVehicle && !matchesCode && !matchesSlot && !matchesType) return false;
      }

      return true;
    });
  }, [schedules, selectedStatus, searchQuery]);

  const handleSelectToken = async (item: any) => {
    try {
      setResolvingTransportCode(item.transport_code);
      let tokenId = item.token_id || item.id;
      let detail: any = null;
      if (item.transport_code) {
        detail = await TokenService.getTokenByCode(item.transport_code);
        if (!tokenId) {
          tokenId = (detail as any)?.token_id ?? (detail as any)?.id;
        }
      }
      if (tokenId) {
        const latestEntry = detail?.vehicle_entries?.[0] || item.vehicle_entries?.[0];
        if (latestEntry) {
          try {
            const entryDetail = await VehicleEntryService.getVehicleEntryDetail(latestEntry.id);
            if (!entryDetail.dumping_photos || entryDetail.dumping_photos.length === 0) {
              setPendingWarningToken({
                tokenId: Number(tokenId),
                tokenNumber: item.token_number,
                vehicleNumber: latestEntry.vehicle_number || entryDetail.vehicle_number,
                entryDate: latestEntry.entry_at,
              });
              setIsTokenPickerOpen(false);
              setShowDumpingWarning(true);
              return;
            }
          } catch (e) {
            console.warn("Could not check dumping photo status:", e);
          }
        }

        setSelectedTokenForSchedule({
          tokenId: Number(tokenId),
          tokenNumber: item.token_number,
        });
        setIsTokenPickerOpen(false);
      } else {
        alert("Unable to resolve token identifier. Please try again.");
      }
    } catch (err) {
      console.error("Failed to load token details:", err);
      alert("Failed to load token details. Please try again.");
    } finally {
      setResolvingTransportCode(null);
    }
  };

  const handleCancelBooking = (schedule: VehicleScheduleResponse) => {
    setCancelScheduleTarget(schedule);
  };

  const executeCancelBooking = () => {
    if (!cancelScheduleTarget) return;
    const scheduleId = cancelScheduleTarget.id;
    cancelSchedule(scheduleId, {
      onSuccess: () => {
        alert("Scheduled vehicle slot cancelled successfully.");
        if (viewPassSchedule?.id === scheduleId) {
          setViewPassSchedule(null);
        }
        setCancelScheduleTarget(null);
        refetch();
        refetchTokens();
      },
      onError: (err: any) => {
        alert(err.response?.data?.detail || "Failed to cancel vehicle schedule.");
      },
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      const d = parseISO(dateStr);
      if (isToday(d)) return "Today";
      if (isTomorrow(d)) return "Tomorrow";
      return format(d, "EEE, dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTimeWindow = (start?: string, end?: string) => {
    if (!start && !end) return "Operational Window";
    return `${start || "08:00"} - ${end || "18:00"}`;
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-69px)] w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-6 py-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)]">
        <div>
          <h1 className="text-lg font-bold text-[#1D1D1F]">My Vehicle Schedules</h1>
          <p className="text-xs text-[#86868B] mt-0.5">
            View active transit passes, scheduled time windows, and entry history at Mount Abu Naka checkpoint.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsTokenPickerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0C83FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-600 active:scale-98 transition-all cursor-pointer"
        >
          <span>Schedule New Vehicle</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-4.5 border border-black/[0.06] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#86868B]">Total Bookings</p>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">{counts.all}</p>
            </div>
            <div className="size-11 rounded-2xl bg-blue-50 text-[#0C83FF] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4.5 border border-black/[0.06] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#86868B]">Active Scheduled Passes</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.scheduled}</p>
            </div>
            <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M6 12h.01M18 12h.01"></path>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4.5 border border-black/[0.06] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#86868B]">Completed Transits</p>
              <p className="text-2xl font-bold text-neutral-800 mt-1">{counts.completed}</p>
            </div>
            <div className="size-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 17h4V5H2v12h3"></path>
                <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path>
                <circle cx="7.5" cy="17.5" r="2.5"></circle>
                <circle cx="17.5" cy="17.5" r="2.5"></circle>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4.5 border border-black/[0.06] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#86868B]">Cancelled / Expired</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{counts.cancelled}</p>
            </div>
            <div className="size-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Active Passes Section (Apple Wallet Presentation) */}
        {activeSchedules.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider">
                  Upcoming Active Transit Passes ({activeSchedules.length})
                </h2>
              </div>
              <span className="text-xs text-[#86868B]">Present QR code at Mount Abu Checkpoint</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D1D1F] to-[#2C2C2E] p-5 text-white shadow-xl flex flex-col justify-between gap-5 border border-white/[0.08] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
                        Active Transit Pass
                      </span>
                      <p className="font-mono text-xs text-neutral-400 mt-1.5">{schedule.schedule_code}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/10">
                      <QRCodeSVG
                        value={schedule.transport_code || `TOKEN-${schedule.token_id}`}
                        size={46}
                        bgColor="transparent"
                        fgColor="#FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Vehicle & Time Details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xl font-black tracking-tight text-white">
                        {schedule.vehicle_number}
                      </span>
                      <span className="text-xs font-medium text-neutral-300">
                        {schedule.vehicle_type_name || "Vehicle"}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col gap-1.5 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Transit Date:</span>
                        <span className="font-bold text-white">{formatDate(schedule.schedule_date)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Time Window:</span>
                        <span className="font-bold text-emerald-300 font-mono">
                          {formatTimeWindow(schedule.start_time, schedule.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5 pt-1 mt-0.5">
                        <span>Slot: {schedule.slot_name || "Slot"}</span>
                        <span>Phase {schedule.phase}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pass Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setViewPassSchedule(schedule)}
                      className="flex-1 rounded-xl bg-white text-[#1D1D1F] py-2.5 px-3 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span>View Pass / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(schedule)}
                      disabled={isCancelling}
                      className="rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 py-2.5 px-3 text-xs font-semibold transition-colors cursor-pointer"
                      title="Cancel Schedule"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Schedules Table & Filter Section */}
        <div className="rounded-3xl bg-white border border-black/[0.06] shadow-sm p-6 flex flex-col gap-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-black/[0.04] rounded-2xl w-fit border border-black/[0.06]">
              {(["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"] as FilterStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    selectedStatus === st
                      ? "bg-white text-[#1D1D1F] shadow-sm border border-black/[0.06]"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  {st === "ALL" ? `All (${counts.all})` : st === "SCHEDULED" ? `Active (${counts.scheduled})` : st === "COMPLETED" ? `Completed (${counts.completed})` : `Cancelled (${counts.cancelled})`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex w-full sm:w-72 items-center gap-2.5 rounded-full border border-black/[0.08] bg-neutral-50 px-3.5 py-2 transition-all focus-within:border-[#0C83FF] focus-within:bg-white focus-within:shadow-sm">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-50">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#1D1D1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.1 11.1" stroke="#1D1D1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate, code, slot..."
                className="w-full border-none bg-transparent p-0 text-xs text-[#1D1D1F] placeholder:text-[#86868B] outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs text-neutral-400 hover:text-neutral-600">✕</button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-2xl border border-black/[0.05]">
            {isLoading ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
                <div className="size-8 animate-spin rounded-full border-3 border-[#0C83FF] border-t-transparent"></div>
                <span className="text-xs font-medium text-[#86868B]">Loading your vehicle schedules...</span>
              </div>
            ) : filteredSchedules.length > 0 ? (
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-neutral-50/70">
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Schedule Code</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Vehicle Plate</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Transit Date</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Time Slot</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Vehicle Type</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Phase</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filteredSchedules.map((item) => {
                    const isSched = item.status === "SCHEDULED";
                    const isComp = item.status === "COMPLETED";

                    const badgeClass = isSched
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isComp
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200";

                    return (
                      <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold text-[#1D1D1F]">{item.schedule_code}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-[#1D1D1F] bg-neutral-100 px-2 py-1 rounded-md border border-black/[0.06]">
                            {item.vehicle_number}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-semibold text-[#1D1D1F]">{formatDate(item.schedule_date)}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-[#1D1D1F]">{item.slot_name || "Slot"}</span>
                            <span className="font-mono text-[11px] text-[#86868B]">{formatTimeWindow(item.start_time, item.end_time)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#515154]">
                          {item.vehicle_type_name || "—"}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#515154]">
                          Phase {item.phase}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setViewPassSchedule(item)}
                              className="rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F] px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Pass
                            </button>
                            {isSched && (
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(item)}
                                className="rounded-lg text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex h-56 w-full flex-col items-center justify-center gap-2 p-6 text-center">
                <div className="size-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1D1D1F]">No vehicle schedules found</p>
                <p className="text-xs text-[#86868B] max-w-sm">
                  {searchQuery ? "No bookings matched your search query." : "You haven't scheduled any vehicle entries yet."}
                </p>

                {!searchQuery && (
                  <button
                    type="button"
                    onClick={() => setIsTokenPickerOpen(true)}
                    className="mt-2 text-xs font-semibold text-[#0C83FF] hover:underline cursor-pointer"
                  >
                    Select Active Token to Schedule →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Active Token Picker Modal (Apple Sheet Style) */}
      <AnimatePresence>
        {isTokenPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-onest">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTokenPickerOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col border border-black/[0.08]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-6 py-4.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[#0C83FF]/10 text-[#0C83FF]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1D1D1F]">
                      Select Token for Vehicle Scheduling
                    </h2>
                    <p className="text-xs text-[#86868B]">
                      Choose an active approved token to book a transit slot.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTokenPickerOpen(false)}
                  className="size-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center text-[#515154] hover:text-[#1D1D1F] transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Tokens List Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA] flex flex-col gap-3.5">
                {isLoadingTokens ? (
                  <div className="flex h-56 w-full flex-col items-center justify-center gap-3">
                    <div className="size-7 animate-spin rounded-full border-3 border-[#0C83FF] border-t-transparent"></div>
                    <span className="text-xs text-[#86868B]">Loading your active tokens...</span>
                  </div>
                ) : activeTokens.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3.5">
                    {activeTokens.map((item) => {
                      const isResolvingThis = resolvingTransportCode === item.transport_code;
                      const remainingPct = Math.round(item.remaining_quantity_pct ?? 100);

                      const isItemExpired =
                        item.status === "EXPIRED" ||
                        (item.valid_till ? new Date(item.valid_till).getTime() < Date.now() : false);

                      return (
                        <div
                          key={item.transport_code}
                          onClick={() => !resolvingTransportCode && !isItemExpired && handleSelectToken(item)}
                          className={`group relative rounded-2xl border p-4.5 shadow-sm transition-all duration-200 ${
                            isItemExpired
                              ? "border-rose-200 bg-rose-50/30 opacity-75 cursor-not-allowed"
                              : "border-black/[0.07] bg-white hover:border-[#0C83FF] hover:shadow-md cursor-pointer"
                          } ${isResolvingThis ? "opacity-75 ring-2 ring-[#0C83FF]" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-base font-bold ${isItemExpired ? "text-rose-700" : "text-[#0C83FF] group-hover:underline"}`}>
                                  {item.token_number}
                                </span>
                                <span className="rounded-full bg-neutral-100 border border-black/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-neutral-700">
                                  Phase {item.phase}
                                </span>
                                {isItemExpired ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-300 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                    EXPIRED
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> ACTIVE
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#86868B] mt-0.5">
                                App No: <strong className="text-[#1D1D1F] font-medium">{item.application_number}</strong>
                              </span>
                            </div>

                            {isItemExpired ? (
                              <span className="rounded-xl bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 text-xs font-semibold">
                                Validity Expired
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={!!resolvingTransportCode}
                                className="rounded-xl bg-[#0C83FF] text-white px-3.5 py-2 text-xs font-semibold shadow-sm group-hover:bg-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                {isResolvingThis ? (
                                  <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <>
                                    <span>Schedule Slot</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <div className="mt-3.5 pt-3 border-t border-black/[0.05] grid grid-cols-2 gap-4 text-xs">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[11px] text-[#86868B]">
                                <span>Remaining Material</span>
                                <span className="font-bold text-[#1D1D1F]">{remainingPct}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                                <div
                                  className={`h-full rounded-full ${isItemExpired ? "bg-rose-400" : "bg-[#0C83FF]"}`}
                                  style={{ width: `${remainingPct}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col justify-center items-end text-right">
                              <span className="text-[11px] text-[#86868B]">Valid Till</span>
                              <span className={`text-xs font-bold ${isItemExpired ? "text-rose-600" : "text-[#1D1D1F]"}`}>
                                {item.valid_till ? format(parseISO(item.valid_till), "dd MMM yyyy") : "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-56 w-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="size-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-[#1D1D1F]">No Active Tokens Found</p>
                    <p className="text-xs text-[#86868B] max-w-sm leading-relaxed">
                      You need an active approved construction token with remaining material quota to schedule vehicle entries.
                    </p>
                    <Link
                      href="/citizen/tokens"
                      onClick={() => setIsTokenPickerOpen(false)}
                      className="mt-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 px-4 py-2 text-xs font-semibold text-[#1D1D1F] transition-colors"
                    >
                      View All Tokens
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-black/[0.06] bg-white px-6 py-3.5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsTokenPickerOpen(false)}
                  className="rounded-full px-5 py-2 text-xs font-medium text-[#515154] hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Vehicle Booking Modal (Apple Sheet Style) */}
      {selectedTokenForSchedule && (
        <ScheduleVehicleModal
          isOpen={!!selectedTokenForSchedule}
          onClose={() => setSelectedTokenForSchedule(null)}
          tokenId={selectedTokenForSchedule.tokenId}
          tokenNumber={selectedTokenForSchedule.tokenNumber}
          onSuccess={() => {
            refetch();
            refetchTokens();
            setSelectedTokenForSchedule(null);
          }}
        />
      )}

      <DumpingWarningModal
        isOpen={showDumpingWarning}
        onClose={() => {
          setShowDumpingWarning(false);
          setPendingWarningToken(null);
        }}
        onProceed={() => {
          if (pendingWarningToken) {
            setSelectedTokenForSchedule({
              tokenId: pendingWarningToken.tokenId,
              tokenNumber: pendingWarningToken.tokenNumber,
            });
          }
          setShowDumpingWarning(false);
          setPendingWarningToken(null);
        }}
        vehicleNumber={pendingWarningToken?.vehicleNumber}
        entryDate={pendingWarningToken?.entryDate}
      />

      {/* Digital Pass / QR Modal */}
      <AnimatePresence>
        {viewPassSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-onest">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewPassSchedule(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-black/[0.08]"
            >
              {/* Card Header (Apple Wallet Black Header) */}
              <div className="bg-gradient-to-br from-[#1D1D1F] to-[#2C2C2E] p-6 text-white flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
                      Mount Abu Transit Pass
                    </span>
                    <h3 className="text-xl font-black font-mono tracking-tight text-white mt-2">
                      {viewPassSchedule.vehicle_number}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewPassSchedule(null)}
                    className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-300 border-t border-white/10 pt-3">
                  <div>
                    <p className="text-[10px] uppercase text-neutral-400">Pass Code</p>
                    <p className="font-mono font-bold text-white">{viewPassSchedule.schedule_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-neutral-400">Status</p>
                    <p className="font-bold text-emerald-400">{viewPassSchedule.status}</p>
                  </div>
                </div>
              </div>

              {/* QR & Transit Information Body */}
              <div className="p-6 flex flex-col items-center gap-5 bg-white">
                {/* Large QR Code Display */}
                <div className="p-4 rounded-3xl bg-neutral-50 border border-black/[0.06] shadow-inner flex flex-col items-center gap-2">
                  <QRCodeSVG
                    value={viewPassSchedule.transport_code || `TOKEN-${viewPassSchedule.token_id}`}
                    size={160}
                    level="H"
                  />
                  <span className="text-[10px] font-mono text-[#86868B] tracking-wider uppercase">
                    Scan at Checkpoint
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="w-full flex flex-col gap-2 rounded-2xl bg-neutral-50 p-4 border border-black/[0.04] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Transit Date:</span>
                    <span className="font-bold text-[#1D1D1F]">{formatDate(viewPassSchedule.schedule_date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Allocated Time Slot:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {formatTimeWindow(viewPassSchedule.start_time, viewPassSchedule.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Slot Name:</span>
                    <span className="font-medium text-[#1D1D1F]">{viewPassSchedule.slot_name || "Slot"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Vehicle Type:</span>
                    <span className="font-medium text-[#1D1D1F]">{viewPassSchedule.vehicle_type_name || "Standard Vehicle"}</span>
                  </div>
                  {viewPassSchedule.property_address && (
                    <div className="flex flex-col gap-0.5 border-t border-black/[0.04] pt-2 mt-1">
                      <span className="text-[10px] text-[#86868B] uppercase">Destination Property</span>
                      <span className="text-xs text-[#1D1D1F] font-medium leading-relaxed">{viewPassSchedule.property_address}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 py-3 text-xs font-bold text-[#1D1D1F] transition-colors cursor-pointer"
                  >
                    Print Pass
                  </button>
                  {viewPassSchedule.status === "SCHEDULED" && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(viewPassSchedule)}
                      className="flex-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-3 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel Slot
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!cancelScheduleTarget}
        title="Cancel Scheduled Transit"
        message={`Are you sure you want to cancel the scheduled transit for vehicle ${cancelScheduleTarget?.vehicle_number} on ${cancelScheduleTarget ? formatDate(cancelScheduleTarget.schedule_date) : ""}?`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        variant="warning"
        isLoading={isCancelling}
        onConfirm={executeCancelBooking}
        onClose={() => setCancelScheduleTarget(null)}
      />
    </div>
  );
}
