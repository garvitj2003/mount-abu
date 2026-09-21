"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useActiveAnnouncements } from "@/hooks/useMasterData";
import { type AnnouncementResponse } from "@/services/masterDataService";

export default function CitizenAnnouncementModal() {
  const { data: activeAnnouncements = [], isLoading } = useActiveAnnouncements();
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoading || !activeAnnouncements || activeAnnouncements.length === 0) {
      return;
    }

    try {
      const dismissedIds: number[] = JSON.parse(
        localStorage.getItem("dismissed_announcements") || "[]"
      );

      // Find the first unread/undismissed announcement
      const unread = activeAnnouncements.find((a) => !dismissedIds.includes(a.id));

      if (unread) {
        setCurrentAnnouncement(unread);
        setIsOpen(true);
      }
    } catch {
      // If parsing fails, just show the latest active one
      setCurrentAnnouncement(activeAnnouncements[0]);
      setIsOpen(true);
    }
  }, [activeAnnouncements, isLoading]);

  const handleDismiss = () => {
    if (currentAnnouncement) {
      try {
        const dismissedIds: number[] = JSON.parse(
          localStorage.getItem("dismissed_announcements") || "[]"
        );
        if (!dismissedIds.includes(currentAnnouncement.id)) {
          dismissedIds.push(currentAnnouncement.id);
          localStorage.setItem("dismissed_announcements", JSON.stringify(dismissedIds));
        }
      } catch (err) {
        console.error("Failed to save dismissed announcement", err);
      }
    }
    setIsOpen(false);
  };

  if (!isOpen || !currentAnnouncement) {
    return null;
  }

  const isScheduleRelated =
    currentAnnouncement.title.toLowerCase().includes("schedule") ||
    currentAnnouncement.title.toLowerCase().includes("vehicle") ||
    currentAnnouncement.message.toLowerCase().includes("schedule") ||
    currentAnnouncement.message.toLowerCase().includes("transit") ||
    currentAnnouncement.message.toLowerCase().includes("walk-in");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl font-onest border border-[#D6D9DE]"
        >
          {/* Top Banner Icon & Header */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0C83FF]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4.5 6 9H2v6h4l5 4.5v-15z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#0C83FF] mb-1">
                Official Announcement
              </span>
              <h3 className="text-lg font-semibold text-[#1A1A1A] leading-snug">
                {currentAnnouncement.title}
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body Message */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-sm font-normal text-[#334155] leading-relaxed whitespace-pre-wrap">
            {currentAnnouncement.message}
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            {isScheduleRelated && (
              <Link
                href="/citizen/schedules"
                onClick={handleDismiss}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C83FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                <span>Schedule Vehicle Entry</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )}
            <button
              onClick={handleDismiss}
              className={`w-full sm:w-auto rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isScheduleRelated
                  ? "border border-[#D6D9DE] bg-white text-[#343434] hover:bg-gray-50"
                  : "bg-[#0C83FF] text-white hover:bg-blue-600"
              }`}
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
