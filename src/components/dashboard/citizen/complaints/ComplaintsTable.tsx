"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMyComplaints } from "@/hooks/useComplaints";
import { useUser } from "@/hooks/useUser";
import { type components } from "@/types/api";
import TablePagination from "@/components/ui/TablePagination";

type ComplaintResponse = components["schemas"]["ComplaintResponse"];
type ComplaintStatus = components["schemas"]["ComplaintStatus"];

// --- Components ---

const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  let colorClass = "text-gray-500";
  let label = status.replace("_", " ");
  let icon = null;

  if (status === "PENDING" || status === "IN_PROGRESS") {
    colorClass = "text-[#EF4444]";
    label = "Open";
    icon = (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.1002 4.8999L4.9002 9.0999" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.9002 4.8999L9.1002 9.0999" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (status === "RESOLVED") {
    colorClass = "text-[#059669]";
    label = "Resolved";
    icon = (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.3999 5.2002L5.7999 8.8002L4.5999 7.6002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (status === "REJECTED") {
    colorClass = "text-red-700";
    label = "Rejected";
  }

  return (
    <div className={`flex items-center gap-1.5 ${colorClass}`}>
      {icon}
      <span className="text-sm font-normal capitalize">{label.toLowerCase()}</span>
    </div>
  );
};

interface ComplaintsTableProps {
  onComplaintClick?: (complaint: ComplaintResponse) => void;
}

export default function ComplaintsTable({ onComplaintClick }: ComplaintsTableProps) {
  const { data: user } = useUser();
  const [filter, setFilter] = useState<ComplaintStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const { data, isLoading } = useMyComplaints({
    status: filter === "All" ? null : filter,
    limit: 50,
  });

  const complaints = data?.items || [];

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

  const filteredComplaints = complaints.filter((comp) => {
    const matchesSearch = 
      comp.title.toLowerCase().includes(search.toLowerCase()) ||
      comp.id.toString().includes(search);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredComplaints.length / limit);
  const paginatedComplaints = filteredComplaints.slice((page - 1) * limit, page * limit);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 font-onest">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
        <span className="text-sm font-medium text-[#343434]">Fetching your complaints...</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 font-onest">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-normal text-[#343434]">All Category</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
             <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

            <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
              {["All", "PENDING", "RESOLVED", "REJECTED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s as any)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    filter === s
                      ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold"
                      : "bg-white text-[#343434] hover:bg-gray-50 border-r border-[#D6D9DE] last:border-r-0"
                  }`}
                >
                  {s === "PENDING" ? "Submitted" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#D6D9DE]">
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Complaint ID</span></th>
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Title</span></th>
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Ward No.</span></th>
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Location</span></th>
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Submitted On</span></th>
              <th className="px-2 py-3 text-left"><span className="text-xs font-semibold text-[#333333] opacity-70">Status</span></th>
              <th className="px-2 py-3 text-left w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.length > 0 ? (
              paginatedComplaints.map((item) => (
                <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-3">
                    <span onClick={() => onComplaintClick?.(item)} className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                      #CMP-{item.id.toString().padStart(4, '0')}
                    </span>
                  </td>
                  <td className="px-2 py-3"><span className="text-sm font-normal text-[#333333] line-clamp-1 max-w-[200px]">{item.title}</span></td>
                  <td className="px-2 py-3"><span className="text-sm font-normal text-[#333333]">{item.ward_id || "—"}</span></td>
                  <td className="px-2 py-3"><span className="text-sm font-normal text-[#333333] line-clamp-1 max-w-[250px]">{item.location_address || "—"}</span></td>
                  <td className="px-2 py-3"><span className="text-sm font-normal text-[#333333]">{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></td>
                  <td className="px-2 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-2 py-3 text-center relative">
                      <button 
                        ref={el => { triggerRefs.current[item.id] = el }}
                        onClick={(e) => handleActionClick(e, item.id)}
                        className="text-[#343434] hover:bg-gray-200 rounded p-1 cursor-pointer transition-colors"
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
              <tr><td colSpan={7} className="px-2 py-10 text-center text-gray-400 font-medium font-onest">No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions Dropdown */}
      {openDropdownId && (
        <div 
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, minWidth: '180px' }}
          className="z-[9999] flex w-max flex-col gap-2 rounded-lg border border-[#D6D9DE] bg-white p-2 shadow-[0px_6px_12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const item = complaints.find(c => c.id === openDropdownId);
              if (item) onComplaintClick?.(item);
              setOpenDropdownId(null);
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/complaints.svg" alt="View" width={24} height={24} />
            <span className="text-sm font-normal text-[#343434]">View Complain</span>
          </button>
          <div className="h-[1px] w-full bg-[#D6D9DE]" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
            }}
            className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Image src="/dashboard/icons/withdraw.svg" alt="Withdraw" width={24} height={24} />
            <span className="text-sm font-normal text-[#EF4444]">Withdraw Complain</span>
          </button>
        </div>
      )}

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
