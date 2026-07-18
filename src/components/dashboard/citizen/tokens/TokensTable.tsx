"use client";

import { useState } from "react";
import TablePagination from "@/components/ui/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useTokens } from "@/hooks/useTokens";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    ACTIVE: "text-[#059669]",
    COMPLETED: "text-gray-500",
    TERMINATED: "text-red-500",
    WITHHELD: "text-orange-500",
    PENDING: "text-[#B39632]",
  };

  return (
    <div className={`flex items-center gap-1.5 ${styles[status] || "text-gray-500"}`}>
      {status === "PENDING" ? (
        <Image src="/dashboard/icons/timer-round.svg" alt="" width={14} height={14} />
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.3999 5.2002L5.7999 8.8002L4.5999 7.6002"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="text-sm font-normal capitalize">{status.toLowerCase()}</span>
    </div>
  );
};

const QuantityProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#0C83FF]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-normal text-[#343434]">{Math.round(percentage)}%</span>
    </div>
  );
};

export default function TokensTable() {
  const router = useRouter();
  const { data: user } = useUser();
  const [search, setSearch] = useState("");
  const { page, limit, setPage, setLimit } = usePagination();

  const { data: tokens = [], isLoading, error } = useTokens({
    offset: (page - 1) * limit,
    limit: limit,
    search: search || undefined,
    citizen_user_id: user?.user_id
  });

  const totalPages = tokens.length === limit ? page + 1 : page;

  const getExportInfo = () => {
  return [
    [
      "Downloaded By",
      user?.name?.trim()
        ? `${user.name} (${user.mobile})`
        : user?.mobile || "Citizen"
    ],
    [
      "Download Date",
      new Date().toLocaleString()
    ],
    [
      "Search",
      search || "No Search"
    ],
    [
      "Page",
      page
    ],
    [
      "Limit",
      limit
    ],
    [
      "Total Records",
      tokens.length
    ]
  ];
};


const exportToExcel = () => {

  const info = getExportInfo();

  const data = tokens.map((item) => ({
    "Token Number": item.token_number,
    "Application No.": item.application_number,
    "Remaining Quantity": `${Math.round(item.remaining_quantity_pct || 0)}%`,
    "Valid Till": item.valid_till
      ? new Date(item.valid_till).toLocaleDateString("en-GB")
      : "-",
    "Token Status": item.status
  }));


  const ws = XLSX.utils.aoa_to_sheet([
    ["Citizen Tokens Export"],
    [],
    ...info,
    [],
    [
      "Token Number",
      "Application No.",
      "Remaining Quantity",
      "Valid Till",
      "Token Status"
    ],
    ...data.map(item => Object.values(item))
  ]);


  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Tokens"
  );


  XLSX.writeFile(
    wb,
    "Citizen_Tokens.xlsx"
  );
};



const exportToPDF = () => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text(
    "Citizen Tokens",
    14,
    15
  );


  // Info section small text
  doc.setFontSize(9);

  let y = 25;

  getExportInfo().forEach(([key, value]) => {

    doc.text(
      `${key}: ${value}`,
      14,
      y
    );

    y += 5;

  });


  // Table
  autoTable(doc, {

    startY: y + 5,

    head: [[
      "Token Number",
      "Application No.",
      "Remaining Qty",
      "Valid Till",
      "Status"
    ]],

    body: tokens.map(item => [

      item.token_number,

      item.application_number,

      `${Math.round(item.remaining_quantity_pct || 0)}%`,

      item.valid_till
        ? new Date(item.valid_till).toLocaleDateString("en-GB")
        : "-",

      item.status

    ]),


    styles:{
      fontSize:8,
      cellPadding:2
    }

  });


  doc.save(
    "Citizen_Tokens.pdf"
  );

};

useEffect(() => {

  const handleExcel = () => {
    exportToExcel();
  };


  const handlePDF = () => {
    exportToPDF();
  };


  window.addEventListener(
    "export-tokens-excel",
    handleExcel
  );


  window.addEventListener(
    "export-tokens-pdf",
    handlePDF
  );


  return () => {

    window.removeEventListener(
      "export-tokens-excel",
      handleExcel
    );


    window.removeEventListener(
      "export-tokens-pdf",
      handlePDF
    );

  };


}, [
  tokens,
  user,
  search,
  page,
  limit
]);

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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border-none bg-transparent p-0 text-sm font-normal text-[#343434] placeholder:text-[#343434]/60 focus:ring-0"
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
                      <span className="text-xs font-semibold text-[#333333] opacity-70">Token Number</span>
                   </div>
                </th>
                <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70">Application No.</span>
                    </div>
                </th>
                <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70">Remaining Quantity</span>
                    </div>
                </th>
                 <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70">Valid Till</span>
                    </div>
                </th>
                <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                       <span className="text-xs font-semibold text-[#333333] opacity-70">Token Status</span>
                    </div>
                </th>
                 <th className="px-2 py-3 text-left w-[40px]">
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((item) => (
                <tr key={item.transport_code} className="border-b border-[#D6D9DE] hover:bg-gray-50">
                  <td className="px-2 py-3">
                    <span 
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search).toString();
                        router.push(`/citizen/tokens/${item.transport_code}${params ? `?${params}` : ""}`);
                      }}
                      className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                    >
                      {item.token_number}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333]">
                      {item.application_number}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <QuantityProgressBar percentage={item.remaining_quantity_pct || 0} />
                  </td>
                   <td className="px-2 py-3">
                    <span className="text-sm font-normal text-[#333333]">
                      {item.valid_till ? new Date(item.valid_till).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                   <td className="px-2 py-3 text-center">
                      <button className="text-[#343434] hover:bg-gray-200 rounded p-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  );
}
