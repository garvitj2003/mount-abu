"use client";

import { useState } from "react";

import TablePagination from "@/components/ui/TablePagination";

// --- Types ---
type Status = "Active";

interface Token {
  id: string;
  tokenNumber: string;
  applicationNo: string;
  remainingQuantity: number; // percentage
  validTill: string;
  status: Status;
}

// --- Data ---
const TOKENS_DATA: Token[] = [
  {
    id: "1",
    tokenNumber: "TKN-2025-014",
    applicationNo: "APP-2025-00321",
    remainingQuantity: 50,
    validTill: "15 Oct 2025",
    status: "Active",
  },
  {
    id: "2",
    tokenNumber: "TKN-2025-014",
    applicationNo: "APP-2025-00345",
    remainingQuantity: 33,
    validTill: "18 Oct 2025",
    status: "Active",
  },
  {
    id: "3",
    tokenNumber: "TKN-2025-022",
    applicationNo: "APP-2025-00366",
    remainingQuantity: 67,
    validTill: "10 Oct 2025",
    status: "Active",
  },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === "Active") {
    return (
      <div className="flex items-center gap-1.5 text-[#059669]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
            stroke="#059669"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.3999 5.2002L5.7999 8.8002L4.5999 7.6002"
            stroke="#059669"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-normal">Active</span>
      </div>
    );
  }

  return null;
};

const QuantityProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#0C83FF]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-normal text-[#343434]">{percentage}%</span>
    </div>
  );
};

export default function TokensTable() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 font-onest">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-60"
          >
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="#343434"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="#343434"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] placeholder:text-[#343434]/60 focus:ring-0"
          />
        </div>

         {/* Right Side Filters */}
         <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50">
                <span className="text-sm font-normal text-[#343434]">All Category</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
             {/* Status Divider Line */}
             <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

            {/* Filter Tabs */}
            <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white">
            <button
                onClick={() => setFilter("All")}
                className={`rounded-l-lg border-r border-[#D6D9DE] px-3 py-2 text-sm font-semibold transition-colors ${
                filter === "All"
                    ? "bg-[#E7F3FF] text-[#0C83FF]"
                    : "bg-white text-[#343434] hover:bg-gray-50"
                }`}
            >
                All
            </button>
            <button
                onClick={() => setFilter("Submitted")}
                className={`border-r border-[#D6D9DE] px-3 py-2 text-sm font-normal transition-colors ${
                filter === "Submitted"
                    ? "bg-[#E7F3FF] text-[#0C83FF]"
                    : "bg-white text-[#343434] hover:bg-gray-50"
                }`}
            >
                Submitted
            </button>
            <button
                onClick={() => setFilter("Resolved")}
                 className={`border-r border-[#D6D9DE] px-3 py-2 text-sm font-normal transition-colors ${
                filter === "Resolved"
                    ? "bg-[#E7F3FF] text-[#0C83FF]"
                    : "bg-white text-[#343434] hover:bg-gray-50"
                }`}
            >
                Resolved
            </button>
            <button
                onClick={() => setFilter("Closed")}
                className={`rounded-r-lg px-3 py-2 text-sm font-normal transition-colors ${
                filter === "Closed"
                    ? "bg-[#E7F3FF] text-[#0C83FF]"
                    : "bg-white text-[#343434] hover:bg-gray-50"
                }`}
            >
                Closed
            </button>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#D6D9DE]">
              <th className="px-2 py-3 text-left">
                 <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Token Number</span>
                 </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Application No.</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Remaining Quantity</span>
                  </div>
              </th>
               <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Valid Till</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                     <span className="text-xs font-semibold text-[#333333] opacity-70">Token Status</span>
                  </div>
              </th>
               <th className="px-2 py-3 text-left w-[40px]">
                  {/* Action Column Placeholder */}
              </th>
            </tr>
          </thead>
          <tbody>
            {TOKENS_DATA.map((item) => (
              <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50">
                <td className="px-2 py-3">
                  <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                    {item.tokenNumber}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.applicationNo}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <QuantityProgressBar percentage={item.remainingQuantity} />
                </td>
                 <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.validTill}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <StatusBadge status={item.status} />
                </td>
                 <td className="px-2 py-3 text-center">
                    <button className="text-[#343434] hover:bg-gray-200 rounded p-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <TablePagination
        currentPage={page}
        totalPages={10} // Mocked
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
