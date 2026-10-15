"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useAllComplaints } from "@/hooks/useComplaints";
import { useComplaintCategories, useWards } from "@/hooks/useMasterData";
import { type components } from "@/types/api";
import TablePagination from "@/components/ui/TablePagination";
import ComplaintViewDrawer from "@/components/dashboard/citizen/complaints/ComplaintViewDrawer";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { usePagination } from "@/hooks/usePagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUser } from "@/hooks/useUser";
import { ComplaintService } from "@/services/complaintService";
import { fetchAllPages, buildExportFileName } from "@/utils/exportFetchAll";

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
      icon = "/dashboard/icons/warning.svg";
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
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const { page, limit, setPage, setLimit } = usePagination();
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { data: user } = useUser();

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

  const { data: categories = [] } = useComplaintCategories();
  const { data: wards = [] } = useWards();

  const { data, isLoading } = useAllComplaints({
    status: filter === "All" ? null : filter,
    category_id: categoryId,
    ward_id: selectedWardId,
    offset: (page - 1) * limit,
    limit: limit,
  });

  const complaints = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Reverting to local search
  const filteredComplaints = useMemo(() => {
    if (!search) return complaints;
    const lowerSearch = search.toLowerCase();
    return complaints.filter((c) =>
      c.title?.toLowerCase().includes(lowerSearch) ||
      c.id.toString().includes(search) ||
      c.applicant_name?.toLowerCase().includes(lowerSearch) ||
      c.location_address?.toLowerCase().includes(lowerSearch)
    );
  }, [complaints, search]);

  const categoryOptions = useMemo(() => [
    { label: "All Categories", value: "" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id }))
  ], [categories]);

  const wardOptions = useMemo(() => [
    { label: "All Wards", value: "" },
    ...wards.map((w) => ({ label: w.name, value: w.id }))
  ], [wards]);

  const handleComplaintClick = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsViewDrawerOpen(true);
  };

  const fetchAllComplaintsForExport = async () => {
    if (total <= 0) return [];
    const all = await fetchAllPages(
      async (offset, limit) => {
        const res = await ComplaintService.getAllComplaints({
          status: filter === "All" ? undefined : filter,
          category_id: categoryId || undefined,
          ward_id: selectedWardId || undefined,
          offset,
          limit,
        });
        return { items: res.items || [], total: res.total };
      },
      total,
      100 // Backend max limit is 100
    );

    if (!search) return all;
    const lowerSearch = search.toLowerCase();
    return all.filter((c) =>
      c.title?.toLowerCase().includes(lowerSearch) ||
      c.id.toString().includes(search) ||
      c.applicant_name?.toLowerCase().includes(lowerSearch) ||
      c.location_address?.toLowerCase().includes(lowerSearch)
    );
  };

  const getActiveFilterMetadata = () => {
    const entries: [string, string][] = [];
    const fileTags: string[] = [];

    if (categoryId) {
      const catName = categories.find((c) => c.id === categoryId)?.name;
      if (catName) {
        entries.push(["Category", catName]);
        fileTags.push(`Category_${catName}`);
      }
    }
    if (filter !== "All") {
      entries.push(["Status", filter]);
      fileTags.push(`Status_${filter}`);
    }
    if (selectedWardId) {
      const wardName = wards.find((w) => w.id === selectedWardId)?.name;
      if (wardName) {
        entries.push(["Ward", wardName]);
        fileTags.push(`Ward_${wardName}`);
      }
    }
    if (search) {
      entries.push(["Search Query", search]);
      fileTags.push(`Search_${search}`);
    }

    return { entries, fileTags };
  };

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      const allComplaints = await fetchAllComplaintsForExport();
      const { entries, fileTags } = getActiveFilterMetadata();

      const wb = XLSX.utils.book_new();
      const wsData: any[][] = [];

      // ================= User Information =================
      wsData.push(["Complaints Report"]);
      wsData.push([]);

      wsData.push(["Name", user?.name ?? "-"]);
      wsData.push(["Role", user?.role ?? "-"]);
      wsData.push(["Mobile", user?.mobile ?? "-"]);
      wsData.push([
        "Generated On",
        new Date().toLocaleString("en-IN"),
      ]);
      wsData.push(["Total Records", allComplaints.length]);

      if (entries.length > 0) {
        wsData.push([]);
        wsData.push(["Filters Applied:"]);
        entries.forEach(([key, val]) => {
          wsData.push([`  ${key}:`, val]);
        });
      }

      wsData.push([]);

      // ================= Complaints =================
      wsData.push(["Complaints"]);
      wsData.push([
        "Complaint ID",
        "Category",
        "Ward",
        "Location",
        "Assigned To",
        "Submitted On",
        "Status",
      ]);

      allComplaints.forEach((item) => {
        wsData.push([
          `CMP-${item.id.toString().padStart(4, "0")}`,
          (item as any).category_name ||
          categories.find((c) => c.id === item.category_id)?.name ||
          "-",
          item.ward_id || "-",
          item.location_address || "-",
          item.assigned_to?.name || "Unassigned",
          item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB")
            : "-",
          item.status.replaceAll("_", " "),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, "Complaints");

      const fileName = buildExportFileName("Complaints", fileTags, "xlsx");
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error("Export Excel error", err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      const allComplaints = await fetchAllComplaintsForExport();
      const { entries, fileTags } = getActiveFilterMetadata();

      const pdf = new jsPDF("landscape");

      pdf.setFontSize(18);
      pdf.text("Complaints Report", 14, 15);

      pdf.setFontSize(10);
      pdf.text(`Name: ${user?.name ?? "-"}`, 14, 24);
      pdf.text(`Role: ${user?.role ?? "-"}`, 14, 30);
      pdf.text(`Mobile: ${user?.mobile ?? "-"}`, 14, 36);
      pdf.text(
        `Generated On: ${new Date().toLocaleString("en-IN")}`,
        14,
        42
      );
      pdf.setFont("helvetica", "bold");
      pdf.text(`Total Records: ${allComplaints.length}`, 14, 48);
      pdf.setFont("helvetica", "normal");

      let startY = 54;
      if (entries.length > 0) {
        pdf.setFontSize(9);
        const filterStr = entries.map(([k, v]) => `${k}: ${v}`).join(", ");
        pdf.text(`Filters: ${filterStr}`, 14, startY);
        startY = 60;
      }

      autoTable(pdf, {
        startY,
        head: [[
          "Complaint ID",
          "Category",
          "Ward",
          "Location",
          "Assigned To",
          "Submitted On",
          "Status",
        ]],

        body: allComplaints.map((item) => [
          `CMP-${item.id.toString().padStart(4, "0")}`,
          (item as any).category_name ||
          categories.find((c) => c.id === item.category_id)?.name ||
          "-",
          item.ward_id || "-",
          item.location_address || "-",
          item.assigned_to?.name || "Unassigned",
          item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB")
            : "-",
          item.status.replaceAll("_", " "),
        ]),

        styles: {
          fontSize: 8,
          cellPadding: 3,
        },

        headStyles: {
          fillColor: [12, 131, 255],
          textColor: 255,
        },

        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      const pdfFileName = buildExportFileName("Complaints", fileTags, "pdf");
      pdf.save(pdfFileName);
    } catch (err) {
      console.error("Export PDF error", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-[#343434]">Complains</h1>
            {total !== undefined && (
              <span className="text-[11px] font-semibold text-[#0C83FF] bg-[#E7F3FF] border border-[#72B7FF] px-2.5 py-0.5 rounded-md">
                Total: {total}
              </span>
            )}
          </div>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View, manage, and resolve citizen complaints while tracking status and ensuring timely action.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            <Image
              src="/dashboard/icons/applications/pdficon.svg"
              alt=""
              width={15}
              height={15}
            />
            {isExportingPDF ? "Exporting..." : "Export PDF"}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Image
              src="/dashboard/icons/applications/csvicon.svg"
              alt=""
              width={15}
              height={15}
              className="invert brightness-0"
            />
            {isExportingExcel ? "Exporting..." : "Export Excel"}
          </button>

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
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
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
              <CustomDropdown
                label="Category"
                options={categoryOptions}
                value={categoryId || ""}
                onSelect={(val) => {
                  setCategoryId(val ? Number(val) : null);
                  setPage(1);
                }}
                placeholder="Select Category"
                width="150px"
              />

              {/* Ward Dropdown */}
              <CustomDropdown
                label="Ward"
                options={wardOptions}
                value={selectedWardId || ""}
                onSelect={(val) => {
                  setSelectedWardId(val ? Number(val) : null);
                  setPage(1);
                }}
                placeholder="Select Ward"
                width="140px"
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
                    className={`px-4 py-2 text-sm transition-colors ${filter === s
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
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent"></div>
                        <span className="text-sm text-gray-500">Loading complaints...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-10 text-center text-sm text-gray-500">
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr key={item.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span
                          onClick={() => handleComplaintClick(item)}
                          className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                        >
                          #CMP-{item.id.toString().padStart(4, '0')}
                        </span>
                      </td>
                      <td className="px-2 py-3">
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
                        <span className="text-sm font-normal text-[#343434]">
                          {item.assigned_to?.name || "Unassigned"}
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
            onLimitChange={setLimit}
          />
        </div>
      </div>

      <ComplaintViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        complaint={selectedComplaint}
      />
    </div>
  );
}
