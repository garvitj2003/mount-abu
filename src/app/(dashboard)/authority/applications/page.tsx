"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import TablePagination from "@/components/ui/TablePagination";
import FilterTabDropdown from "@/components/ui/FilterTabDropdown";
import { useUser } from "@/hooks/useUser";
import { useApplications } from "@/hooks/useApplications";
import { ROLE_FILTERS, type ApplicationFlag } from "@/constants/filters";

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

export default function AuthorityApplicationsPage() {
  const { data: user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<"All" | "New" | "Renovation">("All");
  const [selectedFlag, setSelectedFlag] = useState<ApplicationFlag>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  
  const limit = 10;

  const { data: applications = [], isLoading } = useApplications({
    flag: selectedFlag,
    offset: (page - 1) * limit,
    limit,
  });

  const roleFilters = useMemo(() => {
    if (!user?.role) return null;
    return ROLE_FILTERS[user.role] || null;
  }, [user?.role]);

  const canViewAll = useMemo(() => {
     if (!user?.role) return false;
     return ["SUPERADMIN", "COMMISSIONER", "NODAL_OFFICER"].includes(user.role);
  }, [user?.role]);

  useEffect(() => {
    if (user?.role && !canViewAll && selectedFlag === "ALL") {
      const filters = ROLE_FILTERS[user.role];
      if (filters) {
        // Default to New Construction first, then Renovation
        if (filters.newConstruction.length > 0) {
          setSelectedCategory("New");
          setSelectedFlag(filters.newConstruction[0].value);
        } else if (filters.renovation.length > 0) {
          setSelectedCategory("Renovation");
          setSelectedFlag(filters.renovation[0].value);
        }
      }
    }
  }, [user?.role, canViewAll, selectedFlag]);

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

  // Client-side filtering for Search (since API doesn't support it yet)
  const filteredApplications = applications.filter(app => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      app.applicant_name.toLowerCase().includes(term) ||
      app.id.toString().includes(term) ||
      (app.ward_zone && app.ward_zone.toLowerCase().includes(term))
    );
  });

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

              {/* Role-Based Filters */}
              <div className="flex items-center gap-2">
                {/* All Tab */}
                {canViewAll && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedFlag("ALL");
                    }}
                    className={`h-[38px] px-4 text-sm rounded-lg border transition-colors flex items-center justify-center ${
                      selectedCategory === "All"
                        ? "bg-[#E7F3FF] border-[#0C83FF] text-[#0C83FF] font-semibold"
                        : "bg-white border-[#D6D9DE] text-[#343434] hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                )}

                {/* New Construction Dropdown */}
                {roleFilters?.newConstruction && roleFilters.newConstruction.length > 0 && (
                  <FilterTabDropdown
                    label="New Construction"
                    options={roleFilters.newConstruction}
                    selectedFlag={selectedFlag}
                    category="New"
                    currentCategory={selectedCategory}
                    onSelect={(flag) => {
                      setSelectedCategory("New");
                      setSelectedFlag(flag);
                    }}
                  />
                )}

                {/* Renovation Dropdown */}
                {roleFilters?.renovation && roleFilters.renovation.length > 0 && (
                  <FilterTabDropdown
                    label="Renovation"
                    options={roleFilters.renovation}
                    selectedFlag={selectedFlag}
                    category="Renovation"
                    currentCategory={selectedCategory}
                    onSelect={(flag) => {
                      setSelectedCategory("Renovation");
                      setSelectedFlag(flag);
                    }}
                  />
                )}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-2 py-10 text-center text-gray-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                          #{app.id.toString().padStart(5, '0')}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">{app.applicant_name}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] capitalize">{app.type.toLowerCase()}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">{app.ward_zone || "—"}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] capitalize">{app.property_usage?.toLowerCase() || "—"}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">
                          {new Date().toLocaleDateString("en-GB")} {/* Date from DB? */}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <StatusBadge status={app.status as ApplicationStatus} />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button 
                          ref={el => { triggerRefs.current[app.id.toString()] = el }}
                          onClick={(e) => handleActionClick(e, app.id.toString())}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-2 py-10 text-center text-gray-500">
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
          <TablePagination
            currentPage={page}
            totalPages={10} // Total pages unknown from API, defaulting to 10 for now
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
