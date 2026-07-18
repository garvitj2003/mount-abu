"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import TablePagination from "@/components/ui/TablePagination";
import FilterTabDropdown from "@/components/ui/FilterTabDropdown";
import { useUser } from "@/hooks/useUser";
import { useApplications, useWorkflowAction } from "@/hooks/useApplications";
import { ROLE_FILTERS, type ApplicationFlag } from "@/constants/filters";
import { useRouter } from "next/navigation";
import { useWards } from "@/hooks/useMasterData";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { usePagination } from "@/hooks/usePagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type ApplicationStatus =
  | "PENDING"
  | "SUBMITTED"
  | "FORWARDED"
  | "APPROVED"
  | "TOKEN_GENERATED"
  | "OBJECTED"
  | "REJECTED"
  | "WITHHELD";

const PROPERTY_USAGE_OPTIONS = [
  { label: "Domestic", value: "DOMESTIC" },
  { label: "Commercial", value: "COMMERCIAL" },
  { label: "Government", value: "GOVERNMENT" },
];

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
      bgColor = "bg-[#FFEEB4]";
      textColor = "text-[#9C832C]";
      label = "Under Review";
      break;
    case "FORWARDED":
      bgColor = "bg-[#FFEEB4]";
      textColor = "text-[#9C832C]";
      label = "Forwarded";
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
  const router = useRouter();
  const { data: user } = useUser();
  const { data: wards = [] } = useWards();
  const { page, limit, setPage, setLimit } = usePagination();

  const [selectedCategory, setSelectedCategory] = useState<"All" | "New" | "Renovation">("All");
  const [selectedFlag, setSelectedFlag] = useState<ApplicationFlag>("ALL");
  const [isPendingWithMe, setIsPendingWithMe] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [selectedPropertyUsage, setSelectedPropertyUsage] = useState<string>("");
  const [selectedJurisdictionZone, setSelectedJurisdictionZone] = useState<string>("");
  const hasInitializedDefaultZone = useRef(false);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  // Set default jurisdiction zone from user profile on mount / refresh
  useEffect(() => {
    if (user?.jurisdiction_zone && !hasInitializedDefaultZone.current) {
      setSelectedJurisdictionZone(user.jurisdiction_zone);
      hasInitializedDefaultZone.current = true;
    }
  }, [user]);

  const { data: applications = [], isLoading } = useApplications({
    flag: isPendingWithMe ? "PENDING_WITH_ME" : selectedFlag,
    offset: (page - 1) * limit,
    limit,
    search: debouncedSearch || undefined,
    ward_id: selectedWardId || undefined,
    property_usage: selectedPropertyUsage || undefined,
    jurisdiction_zone: selectedJurisdictionZone || undefined,
  });

  // Since API doesn't return total count, we estimate total pages
  const totalPages = useMemo(() => {
    if (applications.length < limit) return page;
    return page + 1;
  }, [applications.length, page, limit]);

  const { mutateAsync: performAction } = useWorkflowAction();

  const roleFilters = useMemo(() => {
    if (!user?.role) return null;
    return ROLE_FILTERS[user.role] || null;
  }, [user?.role]);

  const canViewAll = useMemo(() => {
    if (!user?.role) return false;
    return ["SUPERADMIN", "COMMISSIONER", "NODAL_OFFICER"].includes(user.role);
  }, [user?.role]);

  const canViewAllDept = useMemo(() => {
    if (!user?.role) return false;
    return ["JEN", "DEPT_LAND", "DEPT_LEGAL", "DEPT_ATP"].includes(user.role) || user.role.startsWith("DEPT");
  }, [user?.role]);

  const isNodalOrAdmin = useMemo(() => {
    if (!user?.role) return false;
    return ["SUPERADMIN", "NODAL_OFFICER"].includes(user.role);
  }, [user?.role]);

  useEffect(() => {
    if (!user?.role) return;

    if (canViewAll) {
      setSelectedCategory("All");
      setSelectedFlag("ALL");
    } else if (canViewAllDept) {
      setSelectedCategory("All");
      setSelectedFlag("ALL_DEPT");
    } else {
      const filters = ROLE_FILTERS[user.role];
      if (filters) {
        if (filters.newConstruction.length > 0) {
          setSelectedCategory("New");
          setSelectedFlag(filters.newConstruction[0].value);
        } else if (filters.renovation.length > 0) {
          setSelectedCategory("Renovation");
          setSelectedFlag(filters.renovation[0].value);
        }
      }
    }
  }, [user?.role, canViewAll, canViewAllDept]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Main actions dropdown
      if (openDropdownId !== null && triggerRefs.current[openDropdownId]?.contains(event.target as Node)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleScroll = () => {
      setOpenDropdownId(null);
    };

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

  const handleQuickApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this application?")) return;
    try {
      await performAction({
        id,
        data: {
          action: "APPROVE",
          remarks: "Quick Approved from management list"
        }
      });
      alert("Application approved successfully!");
      setOpenDropdownId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to approve application.");
    }
  };

  const wardOptions = useMemo(() => [
    { label: "All Wards", value: "" },
    ...wards.map(w => ({ label: w.name, value: w.id }))
  ], [wards]);


  const handleExportExcel = () => {
    try {
      setIsExportingExcel(true);

      const wb = XLSX.utils.book_new();
      const wsData: any[][] = [];

      // ================= User Information =================
      wsData.push(["Applications Report"]);
      wsData.push([]);

      wsData.push(["Name", user?.name ?? "-"]);
      wsData.push(["Role", user?.role ?? "-"]);
      wsData.push(["Mobile", user?.mobile ?? "-"]);
      wsData.push([
        "Generated On",
        new Date().toLocaleString("en-IN"),
      ]);

      wsData.push([]);

      // ================= Applications =================
      wsData.push(["Applications"]);
      wsData.push([
        "Application No",
        "Applicant Name",
        "Application Type",
        "Ward / Zone",
        "Property Usage",
        "Submitted On",
        "Current Status",
      ]);

      applications.forEach((app) => {
        wsData.push([
          app.id.toString().padStart(5, "0"),
          app.applicant_name,
          app.type.toLowerCase() === "new"
            ? "New Construction"
            : "Repair & Renovation",
          app.ward_zone || "-",
          app.property_usage || "-",
          app.created_at
            ? new Date(app.created_at).toLocaleDateString("en-GB")
            : "-",
          app.status.replaceAll("_", " "),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Applications"
      );

      XLSX.writeFile(
        wb,
        `Applications_${Date.now()}.xlsx`
      );
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);

    try {
      const pdf = new jsPDF("landscape");

      // ================= Title =================
      pdf.setFontSize(18);
      pdf.text("Applications Report", 14, 15);

      // ================= User Information =================
      pdf.setFontSize(10);

      pdf.text(`Name: ${user?.name ?? "-"}`, 14, 24);
      pdf.text(`Role: ${user?.role ?? "-"}`, 14, 30);
      pdf.text(`Mobile: ${user?.mobile ?? "-"}`, 14, 36);
      pdf.text(
        `Generated On: ${new Date().toLocaleString("en-IN")}`,
        14,
        42
      );

      // ================= Table =================
      autoTable(pdf, {
        startY: 48,
        head: [[
          "Application No",
          "Applicant",
          "Application Type",
          "Ward / Zone",
          "Property Usage",
          "Submitted On",
          "Status",
        ]],
        body: applications.map((app) => [
          app.id.toString().padStart(5, "0"),
          app.applicant_name,
          app.type === "NEW"
            ? "New Construction"
            : "Repair & Renovation",
          app.ward_zone || "-",
          app.property_usage || "-",
          app.created_at
            ? new Date(app.created_at).toLocaleDateString("en-GB")
            : "-",
          app.status.replaceAll("_", " "),
        ]),
        styles: {
          fontSize: 9,
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

      pdf.save("Applications_Report.pdf");
    } finally {
      setIsExportingPDF(false);
    }
  };



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

        <div className="flex items-center gap-3">

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExportingPDF ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#343434] border-t-transparent" />
            ) : (
              <Image
                src="/dashboard/icons/applications/pdficon.svg"
                alt=""
                width={14}
                height={14}
                className="opacity-60"
              />
            )}

            {isExportingPDF ? "Exporting..." : "Export PDF"}
          </button>

          <div className="h-6 w-px bg-[#D6D9DE]" />

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isExportingExcel ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Image
                src="/dashboard/icons/applications/csvicon.svg"
                alt=""
                width={14}
                height={14}
                className="invert brightness-0"
              />
            )}

            {isExportingExcel ? "Exporting..." : "Export Excel"}
          </button>

        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Filter Group (Search & Pending with me) */}
            <div className="flex items-center gap-2">
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

              {/* Pending with me button for authority roles except superadmin */}
              {user?.role && user.role !== "SUPERADMIN" && (
                <button
                  onClick={() => {
                    setIsPendingWithMe(!isPendingWithMe);
                    setPage(1);
                  }}
                  className={`h-[38px] px-4 text-sm rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${isPendingWithMe
                    ? "bg-[#E6F4EA] border-[#137333] text-[#137333] font-semibold shadow-sm"
                    : "bg-white border-[#D6D9DE] text-[#343434] hover:bg-gray-50"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isPendingWithMe ? "bg-[#137333]" : "bg-gray-400"}`}></span>
                  Pending with me
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Ward/Zone Dropdown */}
              <CustomDropdown
                label="Ward/Zone"
                options={wardOptions}
                value={selectedWardId || ""}
                onSelect={(val) => {
                  setSelectedWardId(val ? Number(val) : null);
                  setPage(1);
                }}
                placeholder="Select Ward"
                width="160px"
              />

              {/* Property Usage Dropdown */}
              <CustomDropdown
                label="Property Usage"
                options={[
                  { label: "All Usages", value: "" },
                  ...PROPERTY_USAGE_OPTIONS
                ]}
                value={selectedPropertyUsage}
                onSelect={(val) => {
                  setSelectedPropertyUsage(val);
                  setPage(1);
                }}
                placeholder="Select Usage"
                width="160px"
              />

              {/* Jurisdiction Dropdown */}
              <CustomDropdown
                label="Jurisdiction"
                options={[
                  { label: "All Jurisdictions", value: "" },
                  { label: "ULB", value: "ULB" },
                  { label: "UIT", value: "UIT" }
                ]}
                value={selectedJurisdictionZone}
                onSelect={(val) => {
                  setSelectedJurisdictionZone(val);
                  setPage(1);
                }}
                placeholder="Select Jurisdiction"
                width="160px"
              />

              {/* Status Divider */}
              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

              {/* Role-Based Filters */}
              <div className="flex items-center gap-2">

                {/* All Tab (Admins/Nodal Officer) */}
                {canViewAll && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedFlag("ALL");
                      setIsPendingWithMe(false);
                      setPage(1);
                    }}
                    className={`h-[38px] px-4 text-sm rounded-lg border transition-colors flex items-center justify-center ${selectedCategory === "All" && !isPendingWithMe
                      ? "bg-[#E7F3FF] border-[#0C83FF] text-[#0C83FF] font-semibold"
                      : "bg-white border-[#D6D9DE] text-[#343434] hover:bg-gray-50"
                      }`}
                  >
                    All
                  </button>
                )}

                {/* All Tab (Department / JEN) */}
                {canViewAllDept && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedFlag("ALL_DEPT");
                      setIsPendingWithMe(false);
                      setPage(1);
                    }}
                    className={`h-[38px] px-4 text-sm rounded-lg border transition-colors flex items-center justify-center ${selectedCategory === "All" && !isPendingWithMe
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
                    currentCategory={isPendingWithMe ? "All" : selectedCategory}
                    onSelect={(flag) => {
                      setSelectedCategory("New");
                      setSelectedFlag(flag);
                      setIsPendingWithMe(false);
                      setPage(1);
                    }}
                  />
                )}

                {/* Renovation Dropdown */}
                {roleFilters?.renovation && roleFilters.renovation.length > 0 && (
                  <FilterTabDropdown
                    label="Repair & Renovation"
                    options={roleFilters.renovation}
                    selectedFlag={selectedFlag}
                    category="Renovation"
                    currentCategory={isPendingWithMe ? "All" : selectedCategory}
                    onSelect={(flag) => {
                      setSelectedCategory("Renovation");
                      setSelectedFlag(flag);
                      setIsPendingWithMe(false);
                      setPage(1);
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
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-[#D6D9DE] hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <span
                          onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            router.push(`/authority/applications/${app.id}?${params.toString()}`);
                          }}
                          className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer"
                        >
                          {app.id.toString().padStart(5, '0')}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">{app.applicant_name}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] capitalize">{app.type.toLowerCase() === "new" ? 'New Construction' : app.type.toLowerCase() === "renovation" ? 'Repair & Renovation' : ''}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">{app.ward_zone || "—"}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434] capitalize">{app.property_usage?.toLowerCase() || "—"}</span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-sm font-normal text-[#343434]">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString("en-GB") : "—"}
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
                            <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              {(() => {
                const app = applications.find(a => a.id.toString() === openDropdownId);
                if (!app) return null;

                const isUnderReview = app.status === "SUBMITTED" || app.status === "FORWARDED";
                const currentParams = new URLSearchParams(window.location.search).toString();

                return (
                  <>
                    <button
                      onClick={() => router.push(`/authority/applications/${app.id}?${currentParams}`)}
                      className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-normal text-[#343434]"
                    >
                      <Image src="/dashboard/icons/edit-pencil.svg" alt="View" width={24} height={24} />
                      View Application
                    </button>
                    <button
                      onClick={() => router.push(`/authority/applications/${app.id}?${currentParams}${currentParams ? '&' : ''}comment=true`)}
                      className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer text-sm font-normal text-[#343434]"
                    >
                      <Image src="/dashboard/icons/comment-icon.svg" alt="Comment" width={24} height={24} />
                      Comment
                    </button>
                    {isNodalOrAdmin && isUnderReview && (
                      <button
                        onClick={() => handleQuickApprove(app.id)}
                        className="flex h-10 w-full items-center gap-[11px] rounded-lg p-2 hover:bg-[#99D4C2]/20 transition-colors cursor-pointer text-sm font-medium text-[#059669]"
                      >
                        <Image src="/dashboard/icons/tick-round-green.svg" alt="Approve" width={20} height={20} className="mx-0.5" />
                        Quick Approve
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

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
