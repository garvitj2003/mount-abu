"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import TablePagination from "@/components/ui/TablePagination";
import { useAuditLogs } from "@/hooks/useAudit";
import { type components } from "@/types/api";
import { usePagination } from "@/hooks/usePagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUser } from "@/hooks/useUser";
import { AuditService } from "@/services/auditService";
import { fetchAllPages, buildExportFileName } from "@/utils/exportFetchAll";

type AuditAction = components["schemas"]["AuditAction"];
type AuditLogResponse = components["schemas"]["AuditLogResponse"];

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Applications", value: "APPLICATION" },
  { label: "Tokens", value: "TOKEN" },
  { label: "Complaints", value: "COMPLAINT" },
  { label: "User Management", value: "USER" },
];

const formatRole = (role?: string | null) => {
  if (!role) return "—";
  switch (role) {
    case "SUPERADMIN": return "Superadmin";
    case "ADMIN": return "Admin";
    case "NODAL_OFFICER": return "Nodal Officer";
    case "COMMISSIONER": return "Commissioner";
    case "COLLECTOR": return "Collector";
    case "JEN": return "Junior Engineer (JEN)";
    case "AEN": return "Assistant Engineer (AEN)";
    case "DEPT_LAND": return "Land Department";
    case "DEPT_LEGAL": return "Legal Department";
    case "DEPT_ATP": return "Town Planning (ATP)";
    case "CITIZEN": return "Citizen";
    case "NAKA_INCHARGE": return "Naka Incharge";
    case "RIN": return "Revenue Inspector (RIN)";
    case "SIN": return "Sanitary Inspector (SIN)";
    default:
      return role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

const getRecordReference = (log: AuditLogResponse) => {
  const entityType = log.entity_type?.toUpperCase() || "";
  const prefix = entityType.substring(0, 3).toUpperCase();
  const recId = log.record_id;
  if (recId) {
    return `${prefix}-${recId.toString().padStart(5, "0")}`;
  }
  return `${prefix}-${log.id.toString().padStart(5, "0")}`;
};

const getRecordUrl = (log: AuditLogResponse) => {
  const entityType = log.entity_type?.toUpperCase() || "";
  const recId = log.record_id;

  if (entityType.startsWith("APPLICATION")) {
    return recId ? `/authority/applications/${recId}` : `/authority/applications`;
  }
  if (entityType.startsWith("TOKEN")) {
    return recId ? `/authority/tokens/${recId}` : `/authority/tokens`;
  }
  if (entityType.startsWith("COMPLAINT")) {
    return recId ? `/authority/complaints?search=${recId}` : `/authority/complaints`;
  }
  if (entityType.startsWith("USER")) {
    return recId ? `/authority/users?search=${recId}` : `/authority/users`;
  }
  if (entityType.startsWith("SLOT")) {
    return `/authority/vehicle-scheduling?tab=slots`;
  }
  if (entityType.startsWith("BLACKOUT") || entityType === "SCHEDULE_BLACKOUT") {
    return `/authority/vehicle-scheduling?tab=blackouts`;
  }
  if (entityType === "VEHICLE_TYPE") {
    return `/authority/vehicle-scheduling?tab=vehicle-types`;
  }
  if (entityType.startsWith("VEHICLE")) {
    return `/authority/vehicle-entries`;
  }
  if (
    entityType.startsWith("MASTER") ||
    ["WARD", "DEPARTMENT", "ROLE", "MATERIAL", "COMPLAINT_CATEGORY"].includes(entityType)
  ) {
    return `/authority/master-data`;
  }
  if (["DOWNLOAD", "EVENT", "LEADER", "ANNOUNCEMENT", "NOTICE", "TENDER"].includes(entityType)) {
    return `/authority/website-content`;
  }
  return null;
};

const UserTooltip = ({
  name,
  role,
  userId,
  index,
}: {
  name?: string | null;
  role?: string | null;
  userId: number;
  index: number;
}) => {
  const isFirstFewRows = index < 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isFirstFewRows ? -10 : 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute left-1/2 z-[100] -translate-x-1/2 pointer-events-none ${
        isFirstFewRows ? "top-full mt-2" : "bottom-full mb-2"
      }`}
    >
      <div className="relative rounded-lg bg-[#343434] px-3.5 py-2.5 shadow-xl w-max max-w-[260px]">
        <div className="flex flex-col gap-1 text-left">
          <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/10 pb-1">
            Performed By
          </p>
          <p className="text-xs font-semibold text-white">
            {name || "User #" + userId}
          </p>
          <div className="flex items-center justify-between gap-3 text-[11px] text-white/70">
            <span>{formatRole(role)}</span>
            <span className="font-mono text-white/40">ID: #{userId}</span>
          </div>
        </div>
        {/* Triangle Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 border-x-8 border-x-transparent ${
            isFirstFewRows
              ? "bottom-full border-b-8 border-b-[#343434]"
              : "top-full border-t-8 border-t-[#343434]"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default function AuthorityAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveTab] = useState("ALL");
  const [hoveredUserLogId, setHoveredUserLogId] = useState<number | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { page, limit, setPage, setLimit } = usePagination();
  const { data: user } = useUser();

  // Reset page when search changes
  const prevSearch = useRef(search);
  useEffect(() => {
    if (search !== prevSearch.current) {
      prevSearch.current = search;
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [search, page, setPage]);

  const { data, isLoading, error } = useAuditLogs({
    offset: (page - 1) * limit,
    limit: limit,
    entity_type: activeFilter === "ALL" ? undefined : activeFilter,
  });

  const logs = data?.logs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case "CREATED": return "text-green-600";
      case "CHANGED": return "text-blue-600";
      case "VIEWED": return "text-gray-600";
      default: return "text-[#343434]";
    }
  };

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const lowerSearch = search.toLowerCase();
    return logs.filter((l) =>
      l.entity_type?.toLowerCase().includes(lowerSearch) ||
      l.action?.toLowerCase().includes(lowerSearch) ||
      l.id?.toString().includes(search) ||
      l.user_id?.toString().includes(search) ||
      l.user_name?.toLowerCase().includes(lowerSearch) ||
      l.user_role?.toLowerCase().includes(lowerSearch) ||
      getRecordReference(l).toLowerCase().includes(lowerSearch)
    );
  }, [logs, search]);

  const fetchAllLogsForExport = async () => {
    if (total <= 0) return [];
    const all = await fetchAllPages(
      async (offset, limit) => {
        const res = await AuditService.getLogs({
          offset,
          limit,
          entity_type: activeFilter === "ALL" ? undefined : activeFilter,
        });
        return { items: res.logs || [], total: res.total };
      },
      total,
      1000 // Backend max limit is 1000
    );

    if (!search) return all;
    const lowerSearch = search.toLowerCase();
    return all.filter((l) =>
      l.entity_type?.toLowerCase().includes(lowerSearch) ||
      l.action?.toLowerCase().includes(lowerSearch) ||
      l.id?.toString().includes(search) ||
      l.user_id?.toString().includes(search) ||
      l.user_name?.toLowerCase().includes(lowerSearch) ||
      l.user_role?.toLowerCase().includes(lowerSearch) ||
      getRecordReference(l).toLowerCase().includes(lowerSearch)
    );
  };

  const getActiveFilterMetadata = () => {
    const entries: [string, string][] = [];
    const fileTags: string[] = [];

    if (activeFilter !== "ALL") {
      const label = FILTERS.find((f) => f.value === activeFilter)?.label || activeFilter;
      entries.push(["Module", label]);
      fileTags.push(`Module_${label}`);
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
      const allLogs = await fetchAllLogsForExport();
      const { entries, fileTags } = getActiveFilterMetadata();

      const wb = XLSX.utils.book_new();
      const wsData: any[][] = [];

      // ================= User Information =================
      wsData.push(["Audit Logs Report"]);
      wsData.push([]);

      wsData.push(["Name", user?.name ?? "-"]);
      wsData.push(["Role", user?.role ?? "-"]);
      wsData.push(["Mobile", user?.mobile ?? "-"]);
      wsData.push([
        "Generated On",
        new Date().toLocaleString("en-IN"),
      ]);
      wsData.push(["Total Records", allLogs.length]);

      if (entries.length > 0) {
        wsData.push([]);
        wsData.push(["Filters Applied:"]);
        entries.forEach(([key, val]) => {
          wsData.push([`  ${key}:`, val]);
        });
      }

      wsData.push([]);

      // ================= Audit Logs =================
      wsData.push(["Audit Logs"]);
      wsData.push([
        "Date & Time",
        "Record Reference",
        "User Role",
        "Performed By",
        "Module",
        "Action",
        "Status",
      ]);

      allLogs.forEach((log) => {
        wsData.push([
          formatDate(log.created_at),
          getRecordReference(log),
          formatRole(log.user_role) || (log.user_id ? `User #${log.user_id}` : "—"),
          log.user_name || "—",
          log.entity_type,
          log.action,
          "Success",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");

      const fileName = buildExportFileName("Audit_Logs", fileTags, "xlsx");
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
      const allLogs = await fetchAllLogsForExport();
      const { entries, fileTags } = getActiveFilterMetadata();

      const doc = new jsPDF("landscape");

      doc.setFontSize(18);
      doc.text("Audit Logs Report", 14, 15);

      doc.setFontSize(10);
      doc.text(`Name: ${user?.name ?? "-"}`, 14, 24);
      doc.text(`Role: ${user?.role ?? "-"}`, 14, 30);
      doc.text(`Mobile: ${user?.mobile ?? "-"}`, 14, 36);
      doc.text(
        `Generated On: ${new Date().toLocaleString("en-IN")}`,
        14,
        42
      );
      doc.setFont("helvetica", "bold");
      doc.text(`Total Records: ${allLogs.length}`, 14, 48);
      doc.setFont("helvetica", "normal");

      let startY = 54;
      if (entries.length > 0) {
        doc.setFontSize(9);
        const filterStr = entries.map(([k, v]) => `${k}: ${v}`).join(", ");
        doc.text(`Filters: ${filterStr}`, 14, startY);
        startY = 60;
      }

      autoTable(doc, {
        startY,
        head: [[
          "Date & Time",
          "Record Reference",
          "User Role",
          "Performed By",
          "Module",
          "Action",
          "Status",
        ]],
        body: allLogs.map((log) => [
          formatDate(log.created_at),
          getRecordReference(log),
          formatRole(log.user_role) || (log.user_id ? `User #${log.user_id}` : "—"),
          log.user_name || "—",
          log.entity_type,
          log.action,
          "Success",
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [12, 131, 255],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      const pdfFileName = buildExportFileName("Audit_Logs", fileTags, "pdf");
      doc.save(pdfFileName);
    } catch (err) {
      console.error("Export PDF error", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-[#343434]">Audit & Logs</h1>
          <p className="text-[12px] font-normal text-[#343434] opacity-80 leading-tight max-w-[600px]">
            View a complete, immutable record of system activities for monitoring, compliance, and accountability purposes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExportingPDF ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#343434] border-t-transparent" />
            ) : (
              <Image src="/dashboard/icons/applications/pdficon.svg" alt="" width={14} height={14} className="opacity-70" />
            )}
            {isExportingPDF ? "Exporting..." : "Export PDF"}
          </button>
          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isExportingExcel ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Image src="/dashboard/icons/applications/csvicon.svg" alt="" width={14} height={14} className="invert brightness-0" />
            )}
            {isExportingExcel ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">

          {/* Search and Tabs */}
          <div className="flex items-center justify-between gap-4">
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

            <div className="flex items-center overflow-hidden rounded-lg border border-[#D6D9DE]">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setActiveTab(filter.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-r border-[#D6D9DE] last:border-r-0 ${activeFilter === filter.value
                    ? "bg-[#E7F3FF] text-[#0C83FF]"
                    : "bg-white text-[#343434] hover:bg-gray-50"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="flex h-[300px] w-full items-center justify-center text-[#EF4444]">
                Failed to load audit logs.
              </div>
            ) : (
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-[#D6D9DE]">
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">Date & Time</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">Record Reference</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">User Role</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">Module</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">Action Performed</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 pr-2">
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => {
                    const recordUrl = getRecordUrl(log);
                    const recordRef = getRecordReference(log);
                    return (
                      <tr key={log.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-3">
                          <span className="text-sm font-normal text-[#343434] opacity-80">{formatDate(log.created_at)}</span>
                        </td>
                        <td className="px-2 py-3">
                          {recordUrl ? (
                            <Link
                              href={recordUrl}
                              className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer inline-flex items-center gap-1 group/ref"
                              title={`View ${log.entity_type.toLowerCase()} details`}
                            >
                              <span>{recordRef}</span>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-40 group-hover/ref:opacity-100 transition-opacity"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-[#343434]">
                              {recordRef}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <div
                            className="relative inline-flex items-center"
                            onMouseEnter={() => setHoveredUserLogId(log.id)}
                            onMouseLeave={() => setHoveredUserLogId(null)}
                          >
                            <span className="text-sm font-medium text-[#343434] cursor-pointer hover:text-[#0C83FF] transition-colors border-b border-dotted border-gray-400">
                              {formatRole(log.user_role) || (log.user_id ? `User #${log.user_id}` : "System")}
                            </span>
                            <AnimatePresence>
                              {hoveredUserLogId === log.id && (
                                <UserTooltip
                                  name={log.user_name}
                                  role={log.user_role}
                                  userId={log.user_id}
                                  index={index}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm font-normal text-[#343434] capitalize">{log.entity_type.toLowerCase().replace(/_/g, " ")}</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-1.5">
                            <Image src="/dashboard/icons/tick-round-green.svg" alt="" width={14} height={14} />
                            <span className="text-sm font-normal text-[#059669]">Success</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-2 py-10 text-center text-sm text-[#343434] opacity-60">
                        No audit logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            totalItems={total}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>
    </div>
  );
}
