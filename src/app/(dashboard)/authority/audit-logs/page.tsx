"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import TablePagination from "@/components/ui/TablePagination";
import { useAuditLogs } from "@/hooks/useAudit";
import { type components } from "@/types/api";
import { usePagination } from "@/hooks/usePagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUser } from "@/hooks/useUser";

type AuditAction = components["schemas"]["AuditAction"];

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Applications", value: "APPLICATION" },
  { label: "Tokens", value: "TOKEN" },
  { label: "Complaints", value: "COMPLAINT" },
  { label: "User Management", value: "USER" },
];

export default function AuthorityAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveTab] = useState("ALL");
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

  const handleExportExcel = () => {
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

    wsData.push([]);

    // ================= Audit Logs =================
    wsData.push(["Audit Logs"]);
    wsData.push([
      "Date & Time",
      "Record Reference",
      "User ID",
      "Module",
      "Action",
      "Status",
    ]);

    logs.forEach((log) => {
      wsData.push([
        formatDate(log.created_at),
        `${log.entity_type.substring(0, 3).toUpperCase()}-${log.id
          .toString()
          .padStart(5, "0")}`,
        `User #${log.user_id}`,
        log.entity_type,
        log.action,
        "Success",
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");

    XLSX.writeFile(
      wb,
      `Audit_Logs_${Date.now()}.xlsx`
    );
  };

  const handleExportPDF = () => {
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

    autoTable(doc, {
      startY: 48,
      head: [[
        "Date & Time",
        "Record Reference",
        "User ID",
        "Module",
        "Action",
        "Status",
      ]],
      body: logs.map((log) => [
        formatDate(log.created_at),
        `${log.entity_type.substring(0, 3).toUpperCase()}-${log.id
          .toString()
          .padStart(5, "0")}`,
        `User #${log.user_id}`,
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

    doc.save("Audit_Logs.pdf");
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
          <button onClick={handleExportPDF} className="flex items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-100 transition-colors cursor-pointer">
            <Image src="/dashboard/icons/applications/pdficon.svg" alt="" width={14} height={14} className="opacity-70" />
            Export PDF
          </button>
          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />
          <button onClick={handleExportExcel} className="flex items-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-sm">
            <Image src="/dashboard/icons/applications/csvicon.svg" alt="" width={14} height={14} className="invert brightness-0" />
            Export Excel
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
                        <span className="text-[11px] font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">User ID</span>
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
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-80">{formatDate(log.created_at)}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">
                          {/* We don't have direct reference code in AuditLogResponse, using ID or entity type + log ID as placeholder */}
                          {log.entity_type.substring(0, 3).toUpperCase()}-{log.id.toString().padStart(5, '0')}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">User #{log.user_id}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] capitalize">{log.entity_type.toLowerCase()}</span>
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
                  ))}
                  {logs.length === 0 && (
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
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>
    </div>
  );
}
