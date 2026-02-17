"use client";

import { useState } from "react";
import Image from "next/image";

const COMPLAINTS_DATA = [
  {
    id: "1",
    complaintId: "CMP-0001",
    category: "Road Maintenance",
    wardNo: "12",
    location: "Neelkanth Road, Mount Abu",
    assignedTo: "Kanhaiya Lal",
    submittedOn: "10 JAN 2026",
    status: "Open",
  },
  {
    id: "2",
    complaintId: "CMP-0001",
    category: "Water Supply",
    wardNo: "5",
    location: "Dhoondhai Area",
    assignedTo: "Kanhaiya Lal",
    submittedOn: "09 JAN 2026",
    status: "Assigned to",
  },
  {
    id: "3",
    complaintId: "CMP-0003",
    category: "Street Light",
    wardNo: "8",
    location: "Market Road",
    assignedTo: "Bhavani Singh",
    submittedOn: "08 JAN 2026",
    status: "Resolved",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let icon = "";
  let textColor = "";
  let label = status;

  switch (status) {
    case "Open":
      icon = "/dashboard/icons/cross-round-red.svg";
      textColor = "text-[#EF4444]";
      break;
    case "Assigned to":
      icon = "/dashboard/icons/timer-round.svg";
      textColor = "text-[#B39632]";
      break;
    case "Resolved":
      icon = "/dashboard/icons/tick-round-green.svg";
      textColor = "text-[#059669]";
      break;
    default:
      return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      <Image src={icon} alt={status} width={14} height={14} />
      <span className={`text-sm font-normal ${textColor}`}>{label}</span>
    </div>
  );
};

export default function AuthorityComplaintsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Complains</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View, manage, and resolve citizen complaints while tracking status and ensuring timely action.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
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

            <div className="flex items-center gap-2">
              {/* Category Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">All Category</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Filter Tabs */}
              <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
                {["All", "Submitted", "Resolved", "Closed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-4 py-2 text-sm transition-colors ${
                      filter === s
                        ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold"
                        : "bg-white text-[#343434] hover:bg-gray-50 border-r border-[#D6D9DE] last:border-r-0"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-[#D6D9DE]">
                  {[
                    "Complaint ID",
                    "Category",
                    "Ward No.",
                    "Location",
                    "Assigned To",
                    "Submitted On",
                    "Status",
                  ].map((header, idx) => (
                    <th key={header} className="px-2 py-3 text-left">
                      <div className={`flex items-center gap-2 ${idx < 6 ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">{header}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-3 text-left w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {COMPLAINTS_DATA.map((item) => (
                  <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3">
                      <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{item.complaintId}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{item.category}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{item.wardNo}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434] line-clamp-1 max-w-[200px]" title={item.location}>{item.location}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{item.assignedTo}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{item.submittedOn}</span>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={item.status} />
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
