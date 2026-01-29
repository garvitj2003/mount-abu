"use client";

import ComplaintsTable from "@/components/dashboard/citizen/complaints/ComplaintsTable";

export default function ComplaintsPage() {
  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">
            Citizen Complaints
          </h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            All service-related complaints, simplified.
          </p>
        </div>
        <button className="rounded-lg bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
          New Complain
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <ComplaintsTable />
      </div>
    </div>
  );
}