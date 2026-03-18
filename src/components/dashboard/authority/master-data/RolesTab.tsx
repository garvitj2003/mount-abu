"use client";

import { useState } from "react";
import Image from "next/image";
import { useRoles } from "@/hooks/useMasterData";
import NewRoleDrawer from "@/components/dashboard/authority/master-data/NewRoleDrawer";
import TablePagination from "@/components/ui/TablePagination";
import { type components } from "@/types/api";

type Role = components["schemas"]["RoleResponse"];
// type User = components["schemas"]["UserResponse"]; // Removed as unused

interface TableColumn {
  header: string;
  key: string;
  width?: string;
  render?: (row: Role) => React.ReactNode;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCreator = (row: Role) => {
  return row.created_by?.name || "System";
};

const ROLE_COLUMNS: TableColumn[] = [
  { header: "Code", key: "code" },
  { header: "Role Name", key: "name" },
  { header: "Status", key: "status" },
  {
    header: "Created by",
    key: "created_by",
    render: (row) => (
      <span className="text-sm font-normal text-[#343434] opacity-70">
        {formatCreator(row)}
      </span>
    ),
  },
  {
    header: "Created On",
    key: "created_at",
    render: (row) => (
      <span className="text-sm font-normal text-[#343434] opacity-70">
        {formatDate(row.created_at || "")}
      </span>
    ),
  },
];

interface RolesTabProps {
  // Removed search: string;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export default function RolesTab({ page, limit, setPage }: RolesTabProps) {
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [search, setSearch] = useState(""); // Local search state
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.code.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredRoles.length / limit);
  const paginatedRoles = filteredRoles.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 min-h-[400px]">
      {/* Search Bar */}
      <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
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
            setPage(1); // Reset page on search
          }}
          className="w-full border-none bg-transparent p-0 text-sm text-[#343434] outline-none"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        {isLoadingRoles ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
          </div>
        ) : (
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-[#D6D9DE]">
                {ROLE_COLUMNS.map((col, idx) => (
                  <th key={idx} className="px-2 py-3 text-left">
                    <div
                      className={`flex items-center gap-2 ${idx < ROLE_COLUMNS.length - 1 ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}
                    >
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">
                        {col.header}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.length > 0 ? (
                paginatedRoles.map((row: Role, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors"
                  >
                    {ROLE_COLUMNS.map((col, colIdx) => (
                      <td key={colIdx} className="px-2 py-3">
                        {col.render ? (
                          col.render(row)
                        ) : col.key === "status" ? (
                          <div className="flex items-center gap-1.5">
                            <Image
                              src={
                                row.status
                                  ? "/dashboard/icons/tick-round-green.svg"
                                  : "/dashboard/icons/cross-round-red.svg"
                              }
                              alt=""
                              width={14}
                              height={14}
                            />
                            <span
                              className={`text-sm font-normal ${row.status ? "text-[#059669]" : "text-[#EF4444]"}`}
                            >
                              {row.status ? "Active" : "Inactive"}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`text-sm ${colIdx === 0 ? "font-medium" : "font-normal text-[#343434] ${colIdx > 0 ? 'opacity-70' : ''}"}`}
                          >
                            
                            {String(row[col.key as keyof Role] || "—")}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={ROLE_COLUMNS.length}
                    className="px-2 py-10 text-center text-gray-400 font-medium font-onest"
                  >
                    No data found.
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
      />

      <NewRoleDrawer
        isOpen={isRoleDrawerOpen}
        onClose={() => setIsRoleDrawerOpen(false)}
      />
    </div>
  );
}
