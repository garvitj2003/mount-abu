"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import TablePagination from "@/components/ui/TablePagination";
import FilterTabDropdown from "@/components/ui/FilterTabDropdown";
import { useUser } from "@/hooks/useUser";
import { useApplications, useWorkflowAction } from "@/hooks/useApplications";
import { ROLE_FILTERS, type ApplicationFlag } from "@/constants/filters";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { data: user } = useUser();
  const { data: wards = [] } = useWards();
  const { page, limit, setPage, setLimit } = usePagination();

  // Initialize state from URL Search Params for persistence across navigation
  const [selectedCategory, setSelectedCategory] = useState<"All" | "New" | "Renovation">(
    () => (searchParams.get("category") as any) || "All"
  );
  const [selectedFlag, setSelectedFlag] = useState<ApplicationFlag>(
    () => (searchParams.get("flag") as any) || "ALL"
  );
  const [isPendingWithMe, setIsPendingWithMe] = useState(
    () => searchParams.get("pending_with_me") === "true"
  );
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") || "");
  const [selectedWardId, setSelectedWardId] = useState<number | null>(
    () => (searchParams.get("ward_id") ? Number(searchParams.get("ward_id")) : null)
  );
  const [selectedPropertyUsage, setSelectedPropertyUsage] = useState<string>(
    () => searchParams.get("property_usage") || ""
  );
  const [selectedJurisdictionZone, setSelectedJurisdictionZone] = useState<string>(
    () => searchParams.get("jurisdiction_zone") || ""
  );
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
    if (user?.jurisdiction_zone && !hasInitializedDefaultZone.current && !searchParams.get("jurisdiction_zone")) {
      setSelectedJurisdictionZone(user.jurisdiction_zone);
      hasInitializedDefaultZone.current = true;
    }
  }, [user, searchParams]);

  // Primary Tab Filters State
  const [activePrimaryTab, setActivePrimaryTab] = useState<"NONE" | "PENDING" | "COMPLETED" | "SUBMISSION_DAYS">(
    () => (searchParams.get("primary_tab") as any) || "NONE"
  );
  const [selectedAuthorityRole, setSelectedAuthorityRole] = useState<string>(
    () => searchParams.get("authority_role") || ""
  );
  const [selectedActionName, setSelectedActionName] = useState<string>("");
  const [pendingDays, setPendingDays] = useState<string>(
    () => searchParams.get("pending_days") || ""
  );
  const [pendingDaysOption, setPendingDaysOption] = useState<string>(() => {
    const pd = searchParams.get("pending_days");
    if (!pd) return "";
    return ["3", "7", "15", "30"].includes(pd) ? pd : "custom";
  });
  const [submittedDays, setSubmittedDays] = useState<string>(
    () => searchParams.get("submitted_days") || ""
  );
  const [submittedDaysOption, setSubmittedDaysOption] = useState<string>(() => {
    const sd = searchParams.get("submitted_days");
    if (!sd) return "";
    return ["3", "7", "15", "30"].includes(sd) ? sd : "custom";
  });

  // Secondary Table Filters State
  const [selectedWardIds, setSelectedWardIds] = useState<number[]>(() => {
    const w = searchParams.get("ward_ids");
    return w ? w.split(",").map(Number).filter(Boolean) : [];
  });
  const [selectedTableStatus, setSelectedTableStatus] = useState<string>(
    () => searchParams.get("status") || ""
  );
  const [openHeaderFilter, setOpenHeaderFilter] = useState<"NONE" | "WARD" | "TYPE" | "USAGE" | "STATUS">("NONE");

  // Keep URL search params in sync with active filter states
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (limit !== 10) params.set("limit", String(limit));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (activePrimaryTab !== "NONE") params.set("primary_tab", activePrimaryTab);
    if (selectedAuthorityRole) params.set("authority_role", selectedAuthorityRole);
    if (pendingDays) params.set("pending_days", pendingDays);
    if (submittedDays) params.set("submitted_days", submittedDays);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedFlag && selectedFlag !== "ALL") params.set("flag", selectedFlag);
    if (selectedWardIds.length > 0) params.set("ward_ids", selectedWardIds.join(","));
    if (selectedPropertyUsage) params.set("property_usage", selectedPropertyUsage);
    if (selectedJurisdictionZone) params.set("jurisdiction_zone", selectedJurisdictionZone);
    if (selectedTableStatus) params.set("status", selectedTableStatus);
    if (isPendingWithMe) params.set("pending_with_me", "true");

    const newQuery = params.toString();
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    page,
    limit,
    debouncedSearch,
    activePrimaryTab,
    selectedAuthorityRole,
    pendingDays,
    submittedDays,
    selectedCategory,
    selectedFlag,
    selectedWardIds,
    selectedPropertyUsage,
    selectedJurisdictionZone,
    selectedTableStatus,
    isPendingWithMe,
  ]);

  const { data: responseData, isLoading } = useApplications({
    flag: isPendingWithMe ? "PENDING_WITH_ME" : selectedFlag,
    offset: (page - 1) * limit,
    limit,
    search: debouncedSearch || undefined,
    ward_id: selectedWardId || undefined,
    ward_ids: selectedWardIds.length > 0 ? selectedWardIds.join(",") : undefined,
    property_usage: selectedPropertyUsage || undefined,
    jurisdiction_zone: selectedJurisdictionZone || undefined,
    primary_tab: activePrimaryTab !== "NONE" ? activePrimaryTab : undefined,
    authority_role: selectedAuthorityRole || undefined,
    action_name: selectedActionName || undefined,
    pending_days: pendingDays ? Number(pendingDays) : undefined,
    submitted_days: submittedDays ? Number(submittedDays) : undefined,
    type: selectedCategory === "New" ? "NEW" : selectedCategory === "Renovation" ? "RENOVATION" : undefined,
    status: selectedTableStatus || undefined,
  });

  const applications = useMemo(() => {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData;
    return responseData.applications || [];
  }, [responseData]);

  const totalCount = useMemo(() => {
    if (!responseData) return 0;
    if (Array.isArray(responseData)) return responseData.length;
    return responseData.total || 0;
  }, [responseData]);

  const totalPages = useMemo(() => {
    return Math.ceil((totalCount || 0) / limit) || 1;
  }, [totalCount, limit]);

  const { mutateAsync: performAction } = useWorkflowAction();

  const roleFilters = useMemo(() => {
    if (!user?.role) return null;
    return ROLE_FILTERS[user.role] || null;
  }, [user?.role]);

  const canViewAll = useMemo(() => {
    if (!user?.role) return false;
    return ["SUPERADMIN", "COMMISSIONER", "NODAL_OFFICER", "COLLECTOR"].includes(user.role);
  }, [user?.role]);

  const canViewAllDept = useMemo(() => {
    if (!user?.role) return false;
    return ["JEN", "DEPT_LAND", "DEPT_LEGAL", "DEPT_ATP"].includes(user.role) || user.role.startsWith("DEPT");
  }, [user?.role]);

  const isNodalOrAdmin = useMemo(() => {
    if (!user?.role) return false;
    return ["SUPERADMIN", "NODAL_OFFICER", "COLLECTOR"].includes(user.role);
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
      <div className="p-5 flex flex-col gap-4">
        <div className="flex w-full flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4">

          {/* Top Filters Row: Search + Primary Workflow Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#D6D9DE]">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex w-[170px] items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-2.5 py-2 shadow-2xs">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="opacity-60 shrink-0">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-xs font-normal text-[#343434] outline-none placeholder:text-[#343434]/60 focus:ring-0"
                />
              </div>

              {/* Jurisdiction Dropdown */}
              <CustomDropdown
                label="Jurisdiction"
                options={[
                  { label: "All", value: "" },
                  { label: "ULB", value: "ULB" },
                  { label: "UIT", value: "UIT" }
                ]}
                value={selectedJurisdictionZone}
                onSelect={(val) => {
                  setSelectedJurisdictionZone(val);
                  setPage(1);
                }}
                placeholder="All"
                width="125px"
              />

              {/* Pending with me button */}
              {user?.role && user.role !== "SUPERADMIN" && user.role !== "COLLECTOR" && (
                <button
                  onClick={() => {
                    setIsPendingWithMe(!isPendingWithMe);
                    setPage(1);
                  }}
                  className={`h-[38px] px-3.5 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPendingWithMe
                      ? "bg-[#E6F4EA] border-[#137333] text-[#137333] font-semibold shadow-2xs"
                      : "bg-white border-[#D6D9DE] text-[#343434] hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isPendingWithMe ? "bg-[#137333]" : "bg-gray-400"}`}></span>
                  Pending with me
                </button>
              )}

              <div className="h-6 w-[1px] bg-[#D6D9DE] mx-0.5 hidden sm:block"></div>

              {/* ── Primary Workflow Tabs (Mutually Exclusive: A, B, C) ── */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setActivePrimaryTab(activePrimaryTab === "PENDING" ? "NONE" : "PENDING");
                    setSubmittedDays("");
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePrimaryTab === "PENDING"
                      ? "bg-[#0C83FF] text-white border-[#0C83FF] shadow-sm font-semibold"
                      : "bg-white text-[#343434] border-[#D6D9DE] hover:bg-gray-50"
                  }`}
                >
                  <span>Pending with Authority</span>
                </button>

                <button
                  onClick={() => {
                    setActivePrimaryTab(activePrimaryTab === "COMPLETED" ? "NONE" : "COMPLETED");
                    setSubmittedDays("");
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePrimaryTab === "COMPLETED"
                      ? "bg-[#0C83FF] text-white border-[#0C83FF] shadow-sm font-semibold"
                      : "bg-white text-[#343434] border-[#D6D9DE] hover:bg-gray-50"
                  }`}
                >
                  <span>Completed by Authority</span>
                </button>

                <button
                  onClick={() => {
                    setActivePrimaryTab(activePrimaryTab === "SUBMISSION_DAYS" ? "NONE" : "SUBMISSION_DAYS");
                    setSelectedAuthorityRole("");
                    setSelectedActionName("");
                    setPendingDays("");
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePrimaryTab === "SUBMISSION_DAYS"
                      ? "bg-[#0C83FF] text-white border-[#0C83FF] shadow-sm font-semibold"
                      : "bg-white text-[#343434] border-[#D6D9DE] hover:bg-gray-50"
                  }`}
                >
                  <span>Pending by Submission Days</span>
                </button>
              </div>
            </div>

            {activePrimaryTab !== "NONE" && (
              <button
                onClick={() => {
                  setActivePrimaryTab("NONE");
                  setSelectedAuthorityRole("");
                  setSelectedActionName("");
                  setPendingDays("");
                  setPendingDaysOption("");
                  setSubmittedDays("");
                  setSubmittedDaysOption("");
                  setPage(1);
                }}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-50"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sub-Filters Inline Bar for Primary Tabs */}
          {(activePrimaryTab === "PENDING" || activePrimaryTab === "COMPLETED") && (
            <div className="flex flex-wrap items-center gap-3 bg-[#F0F7FF] border border-[#BFDBFE] p-2.5 rounded-lg transition-all">
              <CustomDropdown
                label="Select Authority"
                options={[
                  { label: "Select Authority Role", value: "" },
                  { label: "Nodal Officer", value: "NODAL_OFFICER" },
                  { label: "Commissioner", value: "COMMISSIONER" },
                  { label: "Junior Engineer (JEN)", value: "JEN" },
                  { label: "Land Department", value: "DEPT_LAND" },
                  { label: "Legal Department", value: "DEPT_LEGAL" },
                  { label: "ATP Department", value: "DEPT_ATP" },
                ]}
                value={selectedAuthorityRole}
                onSelect={(val) => {
                  setSelectedAuthorityRole(val);
                  setSelectedActionName("");
                  setPage(1);
                }}
                width="210px"
              />

              {activePrimaryTab === "PENDING" && (
                <div className="flex items-center gap-2">
                  <CustomDropdown
                    label="Pending Days"
                    options={[
                      { label: "All Pending Days", value: "" },
                      { label: "> 3 Days", value: "3" },
                      { label: "> 7 Days", value: "7" },
                      { label: "> 15 Days", value: "15" },
                      { label: "> 30 Days", value: "30" },
                      { label: "Custom...", value: "custom" },
                    ]}
                    value={pendingDaysOption}
                    onSelect={(val) => {
                      setPendingDaysOption(val);
                      if (val !== "custom") {
                        setPendingDays(val);
                      } else {
                        setPendingDays("");
                      }
                      setPage(1);
                    }}
                    width="170px"
                  />

                  {pendingDaysOption === "custom" && (
                    <div className="flex items-center gap-1.5 bg-white border border-[#D6D9DE] rounded-lg px-3 py-1.5 shadow-2xs h-[38px]">
                      <span className="text-xs font-medium text-[#343434]">&gt;</span>
                      <input
                        type="number"
                        min={1}
                        placeholder="Days"
                        value={pendingDays}
                        onChange={(e) => {
                          setPendingDays(e.target.value);
                          setPage(1);
                        }}
                        className="w-14 border-none bg-transparent p-0 text-xs font-semibold text-[#0C83FF] outline-none text-center"
                      />
                      <span className="text-xs font-medium text-gray-500">Days</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activePrimaryTab === "SUBMISSION_DAYS" && (
            <div className="flex items-center gap-3 bg-[#F0F7FF] border border-[#BFDBFE] p-2.5 rounded-lg transition-all">
              <CustomDropdown
                label="Submission Days"
                options={[
                  { label: "All Submission Days", value: "" },
                  { label: "> 3 Days", value: "3" },
                  { label: "> 7 Days", value: "7" },
                  { label: "> 15 Days", value: "15" },
                  { label: "> 30 Days", value: "30" },
                  { label: "Custom...", value: "custom" },
                ]}
                value={submittedDaysOption}
                onSelect={(val) => {
                  setSubmittedDaysOption(val);
                  if (val !== "custom") {
                    setSubmittedDays(val);
                  } else {
                    setSubmittedDays("");
                  }
                  setPage(1);
                }}
                width="190px"
              />

              {submittedDaysOption === "custom" && (
                <div className="flex items-center gap-1.5 bg-white border border-[#D6D9DE] rounded-lg px-3 py-1.5 shadow-2xs h-[38px]">
                  <span className="text-xs font-medium text-[#343434]">&gt;</span>
                  <input
                    type="number"
                    min={1}
                    placeholder="Days"
                    value={submittedDays}
                    onChange={(e) => {
                      setSubmittedDays(e.target.value);
                      setPage(1);
                    }}
                    className="w-14 border-none bg-transparent p-0 text-xs font-semibold text-[#0C83FF] outline-none text-center"
                  />
                  <span className="text-xs font-medium text-gray-500">Days</span>
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-[#D6D9DE]">
                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Application No.</span>
                    </div>
                  </th>

                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Applicant Name</span>
                    </div>
                  </th>

                  {/* Application Type Header with Popover Filter */}
                  <th className="px-2 py-3 text-left relative">
                    <div className="flex items-center justify-between gap-1 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">
                        Application Type
                      </span>
                      <button
                        onClick={() => setOpenHeaderFilter(openHeaderFilter === "TYPE" ? "NONE" : "TYPE")}
                        className={`p-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                          selectedCategory !== "All"
                            ? "bg-[#E7F3FF] border border-[#0C83FF] text-[#0C83FF]"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                        title="Filter Application Type"
                      >
                        <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} className={openHeaderFilter === "TYPE" ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>

                    {openHeaderFilter === "TYPE" && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-[#D6D9DE] bg-white p-1.5 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] flex flex-col gap-1">
                        {[
                          { label: "All Types", cat: "All" },
                          { label: "New Construction", cat: "New" },
                          { label: "Repair & Renovation", cat: "Renovation" },
                        ].map((opt) => (
                          <button
                            key={opt.cat}
                            onClick={() => {
                              setSelectedCategory(opt.cat as any);
                              setOpenHeaderFilter("NONE");
                              setPage(1);
                            }}
                            className={`text-xs text-left px-3 py-2 rounded-md transition-colors ${
                              selectedCategory === opt.cat ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold" : "text-[#343434] hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </th>

                  {/* Ward / Zone Header with Multi-Select Popover Filter */}
                  <th className="px-2 py-3 text-left relative">
                    <div className="flex items-center justify-between gap-1 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">
                        Ward / Zone {selectedWardIds.length > 0 && `(${selectedWardIds.length})`}
                      </span>
                      <button
                        onClick={() => setOpenHeaderFilter(openHeaderFilter === "WARD" ? "NONE" : "WARD")}
                        className={`p-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                          selectedWardIds.length > 0
                            ? "bg-[#E7F3FF] border border-[#0C83FF] text-[#0C83FF]"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                        title="Multi-select Wards"
                      >
                        <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} className={openHeaderFilter === "WARD" ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>

                    {openHeaderFilter === "WARD" && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-[#D6D9DE] bg-white p-3 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] max-h-60 overflow-y-auto flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                          <span className="text-xs font-bold text-[#343434]">Filter Wards</span>
                          <button
                            onClick={() => {
                              setSelectedWardIds([]);
                              setPage(1);
                            }}
                            className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>

                        {wards.map((w) => {
                          const isSelected = selectedWardIds.includes(w.id);
                          return (
                            <label key={w.id} className="flex items-center gap-2 text-xs text-[#343434] cursor-pointer hover:bg-gray-50 p-1.5 rounded-md">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedWardIds(selectedWardIds.filter((id) => id !== w.id));
                                  } else {
                                    setSelectedWardIds([...selectedWardIds, w.id]);
                                  }
                                  setPage(1);
                                }}
                                className="rounded border-gray-300 text-[#0C83FF] focus:ring-[#0C83FF]"
                              />
                              <span>{w.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </th>

                  {/* Property Usage Header with Popover Filter */}
                  <th className="px-2 py-3 text-left relative">
                    <div className="flex items-center justify-between gap-1 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">
                        Property Usage
                      </span>
                      <button
                        onClick={() => setOpenHeaderFilter(openHeaderFilter === "USAGE" ? "NONE" : "USAGE")}
                        className={`p-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                          selectedPropertyUsage
                            ? "bg-[#E7F3FF] border border-[#0C83FF] text-[#0C83FF]"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                        title="Filter Property Usage"
                      >
                        <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} className={openHeaderFilter === "USAGE" ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>

                    {openHeaderFilter === "USAGE" && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-44 rounded-lg border border-[#D6D9DE] bg-white p-1.5 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] flex flex-col gap-1">
                        {[
                          { label: "All Usages", value: "" },
                          { label: "Domestic", value: "DOMESTIC" },
                          { label: "Commercial", value: "COMMERCIAL" },
                          { label: "Government", value: "GOVERNMENT" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSelectedPropertyUsage(opt.value);
                              setOpenHeaderFilter("NONE");
                              setPage(1);
                            }}
                            className={`text-xs text-left px-3 py-2 rounded-md transition-colors ${
                              selectedPropertyUsage === opt.value ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold" : "text-[#343434] hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </th>

                  <th className="px-2 py-3 text-left">
                    <div className="flex items-center gap-2 border-r border-[rgba(0,0,0,0.1)] pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">Submitted on</span>
                    </div>
                  </th>

                  {/* Current Status Header with Popover Filter */}
                  <th className="px-2 py-3 text-left relative">
                    <div className="flex items-center justify-between gap-1 pr-2">
                      <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase">
                        Current Status
                      </span>
                      <button
                        onClick={() => setOpenHeaderFilter(openHeaderFilter === "STATUS" ? "NONE" : "STATUS")}
                        className={`p-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                          selectedTableStatus
                            ? "bg-[#E7F3FF] border border-[#0C83FF] text-[#0C83FF]"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                        title="Filter Status"
                      >
                        <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} className={openHeaderFilter === "STATUS" ? "rotate-180 transition-transform" : "transition-transform"} />
                      </button>
                    </div>

                    {openHeaderFilter === "STATUS" && (
                      <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-[#D6D9DE] bg-white p-1.5 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] flex flex-col gap-1">
                        {[
                          { label: "All Statuses", value: "" },
                          { label: "Submitted / Under Review", value: "SUBMITTED" },
                          { label: "Forwarded", value: "FORWARDED" },
                          { label: "Approved", value: "APPROVED" },
                          { label: "Token Issued", value: "TOKEN_GENERATED" },
                          { label: "Objection", value: "OBJECTED" },
                          { label: "Rejected", value: "REJECTED" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSelectedTableStatus(opt.value);
                              setOpenHeaderFilter("NONE");
                              setPage(1);
                            }}
                            className={`text-xs text-left px-3 py-2 rounded-md transition-colors ${
                              selectedTableStatus === opt.value ? "bg-[#E7F3FF] text-[#0C83FF] font-semibold" : "text-[#343434] hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </th>

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
            totalItems={totalCount}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>
    </div>
  );
}
