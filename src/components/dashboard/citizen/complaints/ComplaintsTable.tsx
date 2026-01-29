"use client";

import { useState } from "react";

// --- Types ---
type Status = "Open" | "Resolved";

interface Complaint {
  id: string;
  complaintId: string;
  category: string;
  wardNo: string;
  location: string;
  submittedOn: string;
  status: Status;
}

// --- Data ---
const COMPLAINTS_DATA: Complaint[] = [
  {
    id: "1",
    complaintId: "CMP-0001",
    category: "Road Maintenance",
    wardNo: "12",
    location: "Neelkanth Road, Mount Abu",
    submittedOn: "10 JAN 2026",
    status: "Open",
  },
  {
    id: "2",
    complaintId: "CMP-0001",
    category: "Water Supply",
    wardNo: "5",
    location: "Dhoondhai Area",
    submittedOn: "09 JAN 2026",
    status: "Open",
  },
  {
    id: "3",
    complaintId: "CMP-0003",
    category: "Street Light",
    wardNo: "8",
    location: "Market Road",
    submittedOn: "08 JAN 2026",
    status: "Resolved",
  },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === "Open") {
    return (
      <div className="flex items-center gap-1.5 text-[#EF4444]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
            stroke="#EF4444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.1002 4.8999L4.9002 9.0999"
            stroke="#EF4444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.9002 4.8999L9.1002 9.0999"
            stroke="#EF4444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-normal">Open</span>
      </div>
    );
  }

  if (status === "Resolved") {
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
        <span className="text-sm font-normal">Resolved</span>
      </div>
    );
  }

  return null;
};

export default function ComplaintsTable() {
  const [filter, setFilter] = useState("All");

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
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Complaint ID</span>
                 </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Category</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Ward No.</span>
                  </div>
              </th>
               <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Location</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Submitted On</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                     <span className="text-xs font-semibold text-[#333333] opacity-70">Status</span>
                  </div>
              </th>
               <th className="px-2 py-3 text-left w-[40px]">
                  {/* Action Column Placeholder */}
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPLAINTS_DATA.map((item) => (
              <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50">
                <td className="px-2 py-3">
                  <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                    {item.complaintId}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.category}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.wardNo}
                  </span>
                </td>
                 <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.location}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <span className="text-sm font-normal text-[#333333]">
                    {item.submittedOn}
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
      <div className="flex items-center justify-between pt-2">
        {/* Rows per page */}
        <div className="flex items-center gap-3">
          <span className="text-[12.77px] font-medium text-[#343434]">Show</span>
          <div className="flex items-center justify-between gap-2 rounded border border-[#C6CAD1] bg-white px-3 py-2">
             <span className="text-[14.9px] font-medium text-[#343434]">10</span>
             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[12.77px] font-medium text-[#343434]">Row</span>
        </div>

        {/* Page numbers */}
        <div className="flex items-center gap-3">
            <button className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 1L1 5L5 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
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
             <button className="flex h-[34px] w-[34px] items-center justify-center rounded bg-[#F5F6F7] border border-[#C6CAD1] hover:bg-gray-200">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L1 9" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
}
