"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useComplaint } from "@/hooks/useComplaints";
import { useComplaintCategories } from "@/hooks/useMasterData";
import { type components } from "@/types/api";

type ComplaintResponse = components["schemas"]["ComplaintResponse"];

interface ComplaintViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintResponse | null;
}

export default function ComplaintViewDrawer({
  isOpen,
  onClose,
  complaint: initialComplaint,
}: ComplaintViewDrawerProps) {
  const { data: categories = [] } = useComplaintCategories();
  const { data: complaint, isPending } = useComplaint(initialComplaint?.id || null);

  const displayData = complaint || initialComplaint;

  if (!displayData && !isPending) return null;

  const categoryName = categories.find(c => c.id === displayData?.category_id)?.name || "General";

  const trackerSteps = [
    { 
      label: "Submitted", 
      date: displayData?.created_at ? new Date(displayData.created_at).toLocaleString() : "—", 
      completed: !!displayData 
    },
    { 
      label: "Assigned to authority", 
      date: displayData?.status !== "PENDING" ? new Date(displayData?.updated_at || "").toLocaleString() : "Pending", 
      completed: displayData?.status !== "PENDING" 
    },
    { 
      label: "Resolved", 
      date: displayData?.status === "RESOLVED" ? new Date(displayData.updated_at).toLocaleString() : "—", 
      completed: displayData?.status === "RESOLVED" 
    },
  ];

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
                {displayData ? `#CMP-${displayData.id.toString().padStart(4, '0')}` : "Loading..."}
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
                </div>
              )}

              {displayData && (
                <>
                  {/* Category */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-[#343434] opacity-50">
                      Choose Category
                    </p>
                    <p className="text-sm font-medium text-[#343434]">
                      {categoryName}
                    </p>
                  </div>

                  {/* Info Grid */}
                  <div className="flex gap-10">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-[#343434] opacity-50">
                        Ward No.
                      </p>
                      <p className="text-sm font-medium text-[#343434]">
                        {displayData.ward_id || "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-[#343434] opacity-50">
                        Location
                      </p>
                      <p className="text-sm font-medium text-[#343434]">
                        {displayData.location_address || "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-[#343434] opacity-50">
                        Submitted On
                      </p>
                      <p className="text-sm font-medium text-[#343434]">
                        {new Date(displayData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">
                      detailed complain
                    </p>
                    <p className="text-sm font-normal text-[#343434] leading-relaxed">
                      {displayData.description}
                    </p>
                  </div>

                  {/* Photo */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-[#343434] opacity-50 uppercase">
                      Photo
                    </p>
                    <div className="flex flex-col gap-3">
                      {displayData.media && displayData.media.length > 0 ? (
                        displayData.media.map((m, idx) => (
                          <div key={m.id} className="relative h-[220px] w-full overflow-hidden rounded-xl bg-gray-100">
                            <Image
                              src={m.access_url || "/dashboard/images/hero-bg/1.png"}
                              alt={`Complaint Media ${idx + 1}`}
                              fill
                              unoptimized
                              className="object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/40 px-4 py-2 backdrop-blur-md">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0C83FF]">
                                <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#0C83FF]" />
                              </div>
                              <span className="text-[11px] font-medium text-white">
                                {displayData.location_address || "Location detail not available"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="relative h-[180px] w-full overflow-hidden rounded-xl bg-gray-200">
                          <div className="flex h-full w-full items-center justify-center bg-[#D9D9D9]">
                            <span className="text-xs text-gray-500 font-medium">No photo uploaded</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracker */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-[13px] font-semibold text-[#4B9BC3]">
                      Complain tracker
                    </h3>

                    <div className="space-y-0">
                      {trackerSteps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-6 w-6 items-center justify-center">
                              {step.completed ? (
                                <Image
                                  src="/dashboard/icons/done-tick.svg"
                                  alt="done"
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-[#D6D9DE] bg-white" />
                              )}
                            </div>
                            {index < trackerSteps.length - 1 && (
                              <div
                                className={`h-8 w-[2px] ${step.completed ? "bg-[#0C83FF]" : "bg-[#D6D9DE]"}`}
                              />
                            )}
                          </div>
                          <div className="pb-6">
                            <p
                              className={`text-sm font-bold ${step.completed ? "text-[#343434]" : "text-[#343434]/40"}`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] font-medium text-[#343434]/50">
                              {step.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white">
              <button
                onClick={onClose}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-8 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
