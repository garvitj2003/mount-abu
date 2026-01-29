"use client";

import TokensTable from "@/components/dashboard/citizen/tokens/TokensTable";

export default function TokensPage() {
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
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <TokensTable />
      </div>
    </div>
  );
}