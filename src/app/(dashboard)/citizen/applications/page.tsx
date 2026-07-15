"use client";

import { useState } from "react";
import ApplicationsTable from "@/components/dashboard/citizen/applications/ApplicationsTable";
import NewApplicationModal from "@/components/dashboard/citizen/applications/NewApplicationModal";
import Image from "next/image";

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExportExcel = () => {
    window.dispatchEvent(new Event("export-applications-excel"));
  };

  const handleExportPDF = () => {
    window.dispatchEvent(new Event("export-applications-pdf"));
  };


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

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}

            className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >

            <Image src="/dashboard/icons/applications/pdficon.svg" alt="" width={14} height={14} className="opacity-60" />
            Export PDF
          </button>
          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />
          <button
            onClick={handleExportExcel}

            className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
          >

            <Image src="/dashboard/icons/applications/csvicon.svg" alt="" width={14} height={14} className="invert brightness-0" />
            Export Excel
          </button>
          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg cursor-pointer bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            New Application
          </button>
        </div>
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
