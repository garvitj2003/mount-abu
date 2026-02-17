"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationService } from "@/services/applicationService";
import { type components } from "@/types/api";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type ApplicationStatus = components["schemas"]["ApplicationStatus"];

// --- Components ---

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

interface ApplicationsTableProps {
  onComplaintClick?: (complaint: any) => void;
}

export default function ApplicationsTable({ onComplaintClick }: ApplicationsTableProps) {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"All" | "NEW" | "RENOVATION">("All");
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const { data: applications = [], isLoading } = useApplications({
    flag: "CITIZEN",
    citizen_user_id: user?.user_id,
  });

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

  const handleActionClick = (e: React.MouseEvent, id: number) => {
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

  const handleWithdraw = async (id: number) => {
    if (!confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;
    
    try {
      await ApplicationService.deleteApplication(id);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Withdrawal failed", error);
      alert("Failed to withdraw application.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "All" || app.type === filter;
    const matchesSearch = 
      app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 font-onest">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
        <span className="text-sm font-medium text-[#343434]">Fetching your applications...</span>
      </div>
    );
  }

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
            className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] placeholder:text-[#343434]/60 focus:ring-0 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
          <button
            onClick={() => setFilter("All")}
            className={`border-r border-[#D6D9DE] px-4 py-2 text-sm font-semibold transition-colors ${
              filter === "All"
                ? "bg-[#E7F3FF] text-[#0C83FF]"
                : "bg-white text-[#343434] hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("NEW")}
            className={`border-r border-[#D6D9DE] px-4 py-2 text-sm font-normal transition-colors ${
              filter === "NEW"
                ? "bg-[#E7F3FF] text-[#0C83FF]"
                : "bg-white text-[#343434] hover:bg-gray-50"
            }`}
          >
            New Construction
          </button>
          <button
            onClick={() => setFilter("RENOVATION")}
            className={`px-4 py-2 text-sm font-normal transition-colors ${
              filter === "RENOVATION"
                ? "bg-[#E7F3FF] text-[#0C83FF]"
                : "bg-white text-[#343434] hover:bg-gray-50"
            }`}
          >
            Renovation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#D6D9DE]">
              <th className="px-2 py-3 text-left">
                 <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Application ID</span>
                 </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Application Type</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Property Address</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Applicant</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                     <span className="text-xs font-semibold text-[#333333] opacity-70">Current Status</span>
                  </div>
              </th>
              <th className="px-2 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#333333] opacity-70">Remarks</span>
                  </div>
              </th>
               <th className="px-2 py-3 text-left w-[40px]">
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <tr key={app.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-3">
                    <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                      #{app.id.toString().padStart(5, '0')}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333] capitalize">
                      {app.type.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333] line-clamp-1 max-w-[250px]" title={app.property_address}>
                      {app.property_address}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333]">
                      {app.applicant_name}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333]">
                      {app.description || "—"}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">
                      <button 
                        ref={el => { triggerRefs.current[app.id] = el }}
                        onClick={(e) => handleActionClick(e, app.id)}
                        className="text-[#343434] hover:bg-gray-200 rounded p-1 cursor-pointer transition-colors"
                      >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-2 py-10 text-center text-gray-400 font-medium">
                  No applications found.
                </td>
              </tr>
            )}
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
            minWidth: '180px' 
          }}
          className="z-[9999] flex w-max flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
              // Handle View Application logic
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/applications.svg" alt="View" width={24} height={24} />
            <span className="text-sm font-normal text-[#343434]">View Application</span>
          </button>
          <div className="h-[1px] w-full bg-[#D6D9DE]" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleWithdraw(openDropdownId);
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/withdraw.svg" alt="Withdraw" width={24} height={24} />
            <span className="text-sm font-normal text-[#EF4444]">Withdraw Application</span>
          </button>
        </div>
      )}

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
