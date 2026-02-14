"use client";

import { useState } from "react";
import ApplicationsTable from "@/components/dashboard/citizen/applications/ApplicationsTable";
import NewApplicationModal from "@/components/dashboard/citizen/applications/NewApplicationModal";

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">
            Construction & renovation applications
          </h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            All your new construction and renovation applications go here.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg cursor-pointer bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          New Application
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <ApplicationsTable />
      </div>

      {/* Modal */}
      <NewApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
