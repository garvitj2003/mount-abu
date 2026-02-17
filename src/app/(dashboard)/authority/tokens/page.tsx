"use client";

import { useState } from "react";
import Image from "next/image";

const TOKENS_DATA = [
  {
    tokenNumber: "TKN-2025-014",
    applicationNo: "APP-2025-00321",
    remainingQty: 50,
    validTill: "15 Oct 2025",
    status: "Active",
  },
  {
    tokenNumber: "TKN-2025-014",
    applicationNo: "APP-2025-00345",
    remainingQty: 33,
    validTill: "18 Oct 2025",
    status: "Active",
  },
  {
    tokenNumber: "TKN-2025-022",
    applicationNo: "APP-2025-00366",
    remainingQty: 67,
    validTill: "10 Oct 2025",
    status: "Active",
  },
];

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="flex items-center gap-3 w-full max-w-[120px]">
    <div className="h-1.5 w-full rounded-full bg-[#E5E7EB]">
      <div 
        className="h-1.5 rounded-full bg-[#0C83FF]" 
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-[11px] font-normal text-[#343434] opacity-70">{progress}%</span>
  </div>
);

export default function AuthorityTokensPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Tokens</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View and track material entry tokens issued for your approved renovation applications.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">
          
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-[#D6D9DE]">
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Token Number</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Application No.</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Remaining Quantity</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Valid Till</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Token Status</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 text-left w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {TOKENS_DATA.map((token, idx) => (
                  <tr key={idx} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3">
                      <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{token.tokenNumber}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{token.applicationNo}</span>
                    </td>
                    <td className="px-2 py-3">
                      <ProgressBar progress={token.remainingQty} />
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] opacity-70">{token.validTill}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1.5">
                        <Image src="/dashboard/icons/tick-round-green.svg" alt="Active" width={14} height={14} />
                        <span className="text-sm font-normal text-[#059669]">{token.status}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-[12.77px] font-medium text-[#343434]">Show</span>
              <div className="flex items-center justify-between gap-2 rounded border border-[#C6CAD1] bg-white px-3 py-2">
                <span className="text-[14.9px] font-medium text-[#343434]">10</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>
              <span className="text-[12.77px] font-medium text-[#343434]">Row</span>
            </div>

            <div className="flex items-center gap-3 font-inter">
              <button className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M5 1L1 5L5 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-[#0C83FF] text-[12.77px] font-medium text-white">1</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">2</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">3</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">4</button>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">5</button>
                <span className="flex h-[35px] w-[35px] items-center justify-center text-[12.77px] font-medium text-[#343434]">...</span>
                <button className="flex h-[35px] w-[35px] items-center justify-center rounded bg-transparent text-[12.77px] font-medium text-[#343434] hover:bg-gray-50">10</button>
              </div>
              <button className="flex h-[34px] w-[34px] items-center justify-center rounded border border-[#C6CAD1] bg-[#F5F6F7] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M1 1L5 5L1 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
