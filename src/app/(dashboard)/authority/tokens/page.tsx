"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TablePagination from "@/components/ui/TablePagination";
import { useTokens } from "@/hooks/useTokens";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { usePagination } from "@/hooks/usePagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useUser } from "@/hooks/useUser";


const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="flex items-center gap-3 w-full max-w-[120px]">
    <div className="h-1.5 w-full rounded-full bg-[#E5E7EB]">
      <div
        className="h-1.5 rounded-full bg-[#0C83FF]"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-[11px] font-normal text-[#343434] opacity-70">{Math.round(progress)}%</span>
  </div>
);

const TOKEN_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Withheld", value: "WITHHELD" },
  { label: "Terminated", value: "TERMINATED" },
];

export default function AuthorityTokensPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { page, limit, setPage, setLimit } = usePagination();
  const { data: user } = useUser();

  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  const prevSearch = useRef(debouncedSearch);
  useEffect(() => {
    if (debouncedSearch !== prevSearch.current) {
      prevSearch.current = debouncedSearch;
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [debouncedSearch, page, setPage]);

  const { data: tokens = [], isLoading, error } = useTokens({
    offset: (page - 1) * limit,
    limit: limit,
    search: debouncedSearch || undefined,
    status: selectedStatus || undefined
  });

  // Estimate total pages
  const totalPages = useMemo(() => {
    if (tokens.length < limit) return page;
    return page + 1;
  }, [tokens.length, page, limit]);

  const handleExportExcel = () => {
    setIsExportingExcel(true);

    try {
      const wb = XLSX.utils.book_new();
      const wsData: any[][] = [];

      // ================= User Information =================
      wsData.push(["Tokens Report"]);
      wsData.push([]);

      wsData.push(["Name", user?.name ?? "-"]);
      wsData.push(["Role", user?.role ?? "-"]);
      wsData.push(["Mobile", user?.mobile ?? "-"]);
      wsData.push([
        "Generated On",
        new Date().toLocaleString("en-IN"),
      ]);

      wsData.push([]);

      // ================= Tokens =================
      wsData.push(["Tokens"]);
      wsData.push([
        "Token Number",
        "Application No",
        "Remaining Quantity",
        "Valid Till",
        "Status",
      ]);

      tokens.forEach((token) => {
        wsData.push([
          token.token_number,
          token.application_number
            ? `${token.application_number.toString().padStart(5, "0")}`
            : "-",
          `${Math.round(token.remaining_quantity_pct || 0)}%`,
          token.valid_till
            ? new Date(token.valid_till).toLocaleDateString("en-GB")
            : "-",
          token.status,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, "Tokens");

      XLSX.writeFile(
        wb,
        `tokens-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);

    try {
      const pdf = new jsPDF("landscape");

      pdf.setFontSize(18);
      pdf.text("Tokens Report", 14, 15);

      pdf.setFontSize(10);
      pdf.text(`Name: ${user?.name ?? "-"}`, 14, 24);
      pdf.text(`Role: ${user?.role ?? "-"}`, 14, 30);
      pdf.text(`Mobile: ${user?.mobile ?? "-"}`, 14, 36);
      pdf.text(
        `Generated On: ${new Date().toLocaleString("en-IN")}`,
        14,
        42
      );

      autoTable(pdf, {
        startY: 48,

        head: [[
          "Token Number",
          "Application No",
          "Remaining Quantity",
          "Valid Till",
          "Status",
        ]],

        body: tokens.map((token) => [
          token.token_number,
          token.application_number
            ? `${token.application_number.toString().padStart(5, "0")}`
            : "-",
          `${Math.round(token.remaining_quantity_pct || 0)}%`,
          token.valid_till
            ? new Date(token.valid_till).toLocaleDateString("en-GB")
            : "-",
          token.status,
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

      pdf.save(
        `tokens-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Tokens</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            View and track material entry tokens issued for your approved renovation applications.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center cursor-pointer gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium hover:bg-gray-100"
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
            className="flex items-center cursor-pointer gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Image
              src="/dashboard/icons/applications/csvicon.svg"
              alt=""
              width={15}
              height={15}
              className="invert brightness-0 "
            />
            {isExportingExcel ? "Exporting..." : "Export Excel"}
          </button>

        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">

          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Search Bar */}
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

              {/* Status Filter */}
              <CustomDropdown
                label="Status"
                options={[
                  { label: "All Statuses", value: "" },
                  ...TOKEN_STATUS_OPTIONS
                ]}
                value={selectedStatus}
                onSelect={(val) => {
                  setSelectedStatus(val);
                  setPage(1);
                }}
                placeholder="Select Status"
                width="160px"
              />
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
                Failed to load tokens.
              </div>
            ) : (
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-[#D6D9DE]">
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Token Number</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Application No.</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Remaining Quantity</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Valid Till</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left">
                      <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                        <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Token Status</span>
                      </div>
                    </th>
                    <th className="px-2 py-3 text-left w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, idx) => (
                    <tr key={idx} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span
                          onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            router.push(`/authority/tokens/${token.transport_code}?${params.toString()}`);
                          }}
                          className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                        >
                          {token.token_number}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">
                          {token.application_number ? `#${token.application_number.toString().padStart(5, '0')}` : '—'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <ProgressBar progress={token.remaining_quantity_pct || 0} />
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] opacity-70">
                          {token.valid_till ? new Date(token.valid_till).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1.5">
                          <Image
                            src={token.status === "PENDING" ? "/dashboard/icons/timer-round.svg" : token.status === "WITHHELD" ? "/dashboard/icons/withheld.svg" : token.status === "TERMINATED" ? "/dashboard/icons/cross-round-red.svg" : "/dashboard/icons/tick-round-green.svg"}
                            alt="Status"
                            width={14}
                            height={14}
                          />
                          <span className={`text-sm font-normal ${token.status === 'COMPLETED' ? 'text-gray-500' :
                            token.status === 'PENDING' ? 'text-[#B39632]' :
                              token.status === 'TERMINATED' ? 'text-red-500' :
                                token.status === 'WITHHELD' ? 'text-[#9C832C]' :
                                  'text-[#059669]'
                            }`}>
                            {token.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tokens.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-2 py-10 text-center text-sm text-[#343434] opacity-60">
                        No tokens found.
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
