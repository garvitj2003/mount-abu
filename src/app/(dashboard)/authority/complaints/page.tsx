"use client";

import { useState } from "react";
import Image from "next/image";
import { useAllComplaints } from "@/hooks/useComplaints";
import { useComplaintCategories } from "@/hooks/useMasterData";
import { type components } from "@/types/api";
import DropdownSelect from "@/components/ui/DropdownSelect";
import TablePagination from "@/components/ui/TablePagination";

type ComplaintStatus = components["schemas"]["ComplaintStatus"];

const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  let icon = "";
  let textColor = "";
  let label = status.replace("_", " ");

  switch (status) {
    case "PENDING":
      icon = "/dashboard/icons/cross-round-red.svg";
      textColor = "text-[#EF4444]";
      label = "Submitted";
      break;
    case "IN_PROGRESS":
      icon = "/dashboard/icons/timer-round.svg";
      textColor = "text-[#B39632]";
      label = "In Progress";
      break;
    case "RESOLVED":
      icon = "/dashboard/icons/tick-round-green.svg";
      textColor = "text-[#059669]";
      label = "Resolved";
      break;
    case "REJECTED":
    case "WITHDRAWN":
    case "WITHHELD":
      icon = "/dashboard/icons/warning.svg"; // Fallback or specific icon
      textColor = "text-[#EF4444]";
      label = status.charAt(0) + status.slice(1).toLowerCase();
      break;
    default:
      icon = "/dashboard/icons/question-mark.svg";
      textColor = "text-gray-500";
      label = status;
  }

  return (
    <div className="flex items-center gap-1.5">
      {icon && <Image src={icon} alt={status} width={14} height={14} />}
      <span className={`text-sm font-normal ${textColor}`}>{label}</span>
    </div>
  );
};

export default function AuthorityComplaintsPage() {
  const [filter, setFilter] = useState<ComplaintStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "All">("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categories } = useComplaintCategories();

  const { data, isLoading } = useAllComplaints({
    status: filter === "All" ? null : filter,
    category_id: categoryId === "All" ? null : categoryId,
    offset: (page - 1) * limit,
    limit: limit,
  });

  const complaints = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredComplaints = complaints.filter((c) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toString().includes(search) ||
    c.applicant_name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryOptions = [
    { label: "All Category", value: "All" },
    ...(categories?.map((cat) => ({ label: cat.name, value: cat.id })) || [])
  ];

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

            <div className="flex items-center gap-2 h-9">
              {/* Category Dropdown */}
              <DropdownSelect
                options={categoryOptions}
                value={categoryId}
                onChange={(val) => setCategoryId(val === "All" ? "All" : Number(val))}
                className="w-[160px] h-full"
              />

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Filter Tabs */}
              <div className="flex items-center rounded-lg border border-[#D6D9DE] bg-white overflow-hidden">
                {(["All", "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                        setFilter(s);
                        setPage(1);
                    }}
                    className={`px-4 py-2 text-sm transition-colors ${
                      filter === s
                        ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold"
                        : "bg-white text-[#343434] hover:bg-gray-50 border-r border-[#D6D9DE] last:border-r-0"
                    }`}
                  >
                    {s === "All" ? "All" : 
                     s === "PENDING" ? "Submitted" :
                     s === "IN_PROGRESS" ? "In Progress" :
                     s === "RESOLVED" ? "Resolved" : "Closed"}
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
                    "Assigned To", // Note: API might not have this, we'll check.
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
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-2 py-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent"></div>
                         <span className="text-sm text-gray-500">Loading complaints...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-2 py-10 text-center text-sm text-gray-500">
                            No complaints found.
                        </td>
                    </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                            #CMP-{item.id.toString().padStart(4, '0')}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        {/* Assuming category_name is available in ComplaintRow based on schema. 
                            If not, we might need to map category_id to name using categories list */}
                        <span className="text-sm font-normal text-[#343434]">
                            {(item as any).category_name || categories?.find(c => c.id === item.category_id)?.name || "—"}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">{item.ward_id || "—"}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] line-clamp-1 max-w-[200px]" title={item.location_address || ""}>
                            {item.location_address || "—"}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        {/* API response for getAllComplaints might not have assignedTo yet. 
                            ComplaintRow schema has: complaint_id, title, category_name, status, applicant_name, created_at.
                            It does NOT have assignedTo. I'll put "-" for now or applicant_name if that's what we want.
                            Wait, the mock had "Assigned To". The citizen view shows "Ward No", "Location".
                            The authority view shows "Assigned To".
                            If the API doesn't return it, I can't show it. I'll use "—" for now.
                        */}
                        <span className="text-sm font-normal text-[#343434]">
                            —
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">
                            {new Date(item.created_at || "").toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
