"use client";

import TokensTable from "@/components/dashboard/citizen/tokens/TokensTable";
import Image from "next/image";

export default function TokensPage() {

const handleExportExcel = () => {
  window.dispatchEvent(new Event("export-tokens-excel"));
};

const handleExportPDF = () => {
  window.dispatchEvent(new Event("export-tokens-pdf"));
};


  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">
            Tokens
          </h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View and track material entry tokens issued for your approved renovation applications.
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
                  </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <TokensTable />
      </div>
    </div>
  );
}