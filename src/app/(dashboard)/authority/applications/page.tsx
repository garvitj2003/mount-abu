"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ApplicationStatus = 
  | "PENDING"
  | "SUBMITTED"
  | "FORWARDED"
  | "APPROVED"
  | "TOKEN_GENERATED"
  | "OBJECTED"
  | "REJECTED"
  | "WITHHELD";

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  let bgColor = "";
  let textColor = "";
  let label = status.replace("_", " ");

  switch (status) {
    case "PENDING":
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      break;
    case "SUBMITTED":
    case "FORWARDED":
      bgColor = "bg-[#FFEEB4]";
      textColor = "text-[#9C832C]";
      label = "Under Review";
      break;
    case "APPROVED":
    case "TOKEN_GENERATED":
      bgColor = "bg-[#99D4C2]";
      textColor = "text-[#04694A]";
      label = status === "TOKEN_GENERATED" ? "Token Issued" : "Approved";
      break;
    case "OBJECTED":
      bgColor = "bg-orange-100";
      textColor = "text-orange-700";
      label = "Objection";
      break;
    case "REJECTED":
      bgColor = "bg-[#F8B2B2]";
      textColor = "text-[#922929]";
      break;
    case "WITHHELD":
      bgColor = "bg-purple-100";
      textColor = "text-purple-700";
      break;
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded px-2 py-1 ${bgColor}`}
    >
      <span className={`text-[11px] font-normal capitalize ${textColor}`}>{label.toLowerCase()}</span>
    </div>
  );
};

const APPLICATIONS_DATA = [
  {
    id: "1",
    appNo: "APP-2025-00321",
    applicantName: "Rajesh Patel",
    type: "Renovation",
    ward: "Ward 3",
    usage: "Domestic",
    submittedOn: "05 Oct 2025",
    status: "APPROVED" as ApplicationStatus,
  },
  {
    id: "2",
    appNo: "APP-2025-00345",
    applicantName: "Meena Joshi",
    type: "Renovation",
    ward: "Ward 5",
    usage: "Commercial",
    submittedOn: "06 Oct 2025",
    status: "SUBMITTED" as ApplicationStatus,
  },
  {
    id: "3",
    appNo: "APP-2025-00366",
    applicantName: "Anil Sharma",
    type: "Renovation",
    ward: "Ward 2",
    usage: "Hotel",
    submittedOn: "07 Oct 2025",
    status: "OBJECTED" as ApplicationStatus,
  },
  {
    id: "4",
    appNo: "APP-2025-00389",
    applicantName: "Sunita Devi",
    type: "New Construction",
    ward: "Ward 6",
    usage: "Domestic",
    submittedOn: "07 Oct 2025",
    status: "TOKEN_GENERATED" as ApplicationStatus,
  },
  {
    id: "5",
    appNo: "APP-2025-00389",
    applicantName: "Mohan Lal",
    type: "New Construction",
    ward: "Ward 1",
    usage: "Domestic",
    submittedOn: "08 Oct 2025",
    status: "REJECTED" as ApplicationStatus,
  },
];

export default function AuthorityApplicationsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null && triggerRefs.current[openDropdownId]?.contains(event.target as Node)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    const handleScroll = () => setOpenDropdownId(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [openDropdownId]);

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 195,
      });
      setOpenDropdownId(id);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Applications</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View, verify, and take action on construction and renovation applications submitted by citizens within municipal limits.
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
              {/* Ward/Zone Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">Ward/Zone</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>

              {/* Property Usage Dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">Property Usage</span>
                <Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} className="opacity-60" />
              </div>

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Filter Tabs */}
              <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
                {["All", "New Construction", "Renovation"].map((s) => (
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
                    "Application No.",
                    "Applicant Name",
                    "Application Type",
                    "Ward / Zone",
                    "Property Usage",
                    "Submitted on",
                    "Current Status",
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
                {APPLICATIONS_DATA.map((app) => (
                  <tr key={app.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3">
                      <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{app.appNo}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{app.applicantName}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{app.type}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{app.ward}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{app.usage}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-sm font-normal text-[#343434]">{app.submittedOn}</span>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button 
                        ref={el => { triggerRefs.current[app.id] = el }}
                        onClick={(e) => handleActionClick(e, app.id)}
                        className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors"
                      >
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

          {/* Actions Dropdown */}
          {openDropdownId && (
            <div 
              ref={dropdownRef}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'fixed', 
                top: dropdownPos.top, 
                left: dropdownPos.left,
                minWidth: '195px' 
              }}
              className="z-[9999] flex w-max flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200"
            >
              <button 
                className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-normal text-[#343434]"
              >
                <Image src="/dashboard/icons/edit-pencil.svg" alt="View" width={24} height={24} />
                View Application
              </button>
              <button 
                className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-normal text-[#343434]"
              >
                <Image src="/dashboard/icons/comment-icon.svg" alt="Comment" width={24} height={24} />
                Comment
              </button>
              <button 
                className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-[#99D4C2]/20 transition-colors cursor-pointer text-sm font-medium text-[#059669]"
              >
                {/* Note: using tick-round-green instead of blue done-tick to match design reference visually */}
                <Image src="/dashboard/icons/tick-round-green.svg" alt="Approve" width={20} height={20} className="mx-0.5" />
                Quick Approve
              </button>
            </div>
          )}

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
