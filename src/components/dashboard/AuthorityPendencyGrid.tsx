"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardIcon } from "@/components/common/stats/StatCard";
import { type components } from "@/types/api";

type AuthorityPendencyItem = components["schemas"]["AuthorityPendencyItem"];

interface AuthorityPendencyGridProps {
  items?: AuthorityPendencyItem[] | null;
  userRole?: string;
}

const ROLE_COLORS: Record<string, string> = {
  NODAL_OFFICER: "#0C83FF", // Blue
  COMMISSIONER: "#8B5CF6",  // Purple
  JEN: "#F58646",           // Orange
  DEPT_LAND: "#059669",     // Green
  DEPT_LEGAL: "#6366F1",    // Indigo
  DEPT_ATP: "#F59E0B",      // Amber
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  NODAL_OFFICER: "Verification & Token Issuance",
  COMMISSIONER: "Approvals & Inter-Dept Forwards",
  JEN: "Site Inspection & Material Entry",
  DEPT_LAND: "Land Clearance & Boundary Review",
  DEPT_LEGAL: "Legal Title & Litigation Scrutiny",
  DEPT_ATP: "Zoning & Master Plan Compliance",
};

export const AuthorityPendencyGrid: React.FC<AuthorityPendencyGridProps> = ({
  items,
  userRole,
}) => {
  const router = useRouter();

  if (!items || items.length === 0) {
    return null;
  }

  // Commissioner must never see Nodal Officer pendency
  const visibleItems = userRole === "COMMISSIONER"
    ? items.filter((item) => item.role !== "NODAL_OFFICER")
    : items;

  if (visibleItems.length === 0) {
    return null;
  }

  const handleCardClick = (role: string) => {
    router.push(`/authority/applications?primary_tab=PENDING&authority_role=${encodeURIComponent(role)}`);
  };

  const handleOverdueClick = (e: React.MouseEvent, role: string) => {
    e.stopPropagation();
    router.push(`/authority/applications?primary_tab=PENDING&authority_role=${encodeURIComponent(role)}&pending_days=15`);
  };

  const totalAllPendency = visibleItems.reduce((acc, curr) => acc + (curr.total_count || 0), 0);
  const totalOver15Days = visibleItems.reduce((acc, curr) => acc + (curr.over_15_days_count || 0), 0);

  return (
    <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
      {/* Section Header matching Dashboard Hierarchy */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-xs font-medium text-[#343434]">Applications Pending with Authorities</h3>
          <p className="text-[11px] font-light text-[#6D727A]">
            Applications awaiting verification or approval across departments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-light text-[#6D727A]">
            Total Pending: <strong className="font-semibold text-[#343434]">{totalAllPendency}</strong>
          </span>
          {totalOver15Days > 0 && (
            <span className="rounded bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-semibold text-[#EF4444]">
              {totalOver15Days} &gt; 15 Days
            </span>
          )}
        </div>
      </div>

      {/* Grid: 3 cards a row */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => {
          const color = ROLE_COLORS[item.role] || "#0C83FF";
          const displayCount = (item.total_count || 0).toString().padStart(2, "0");
          const description = ROLE_DESCRIPTIONS[item.role] || "Review & Action";

          return (
            <div
              key={item.role}
              onClick={() => handleCardClick(item.role)}
              className="group flex flex-col justify-between rounded-lg border border-[#D6D9DE] bg-white p-3.5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)] hover:border-[#0C83FF] hover:shadow-[0px_2px_8px_0px_rgba(12,131,255,0.12)] transition-all cursor-pointer"
            >
              {/* Top: Title, Description, and Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-[#343434] truncate group-hover:text-[#0C83FF] transition-colors" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-light text-[#6D727A] truncate mt-0.5">
                    {description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <DashboardIcon type="applications" color={color} />
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#6D727A] opacity-40 group-hover:opacity-100 group-hover:text-[#0C83FF] transition-all shrink-0"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom: Main Count & Horizontal Breakdown (Compact Height) */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#D6D9DE]/60 pt-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold leading-none" style={{ color }}>
                    {displayCount}
                  </span>
                  <span className="text-[10px] font-light text-[#6D727A]">Pending</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#6D727A] font-light">
                    Review: <strong className="font-medium text-[#343434]">{item.pending_count}</strong>
                  </span>
                  <span className="text-[#D6D9DE]">|</span>
                  <span className="text-[#6D727A] font-light">
                    Objected:{" "}
                    <strong
                      className={
                        item.objected_count > 0 ? "font-medium text-[#EF4444]" : "font-normal text-[#343434]"
                      }
                    >
                      {item.objected_count}
                    </strong>
                  </span>
                  <span className="text-[#D6D9DE]">|</span>
                  <span className="text-[#6D727A] font-light flex items-center gap-1">
                    &gt; 15D:
                    {item.over_15_days_count > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => handleOverdueClick(e, item.role)}
                        title="Click to view applications pending > 15 days"
                        className="rounded bg-[#FEE2E2] px-1 py-0.2 text-[10px] font-semibold text-[#EF4444] hover:bg-[#FECACA] transition-colors cursor-pointer"
                      >
                        {item.over_15_days_count}
                      </button>
                    ) : (
                      <strong className="font-normal text-[#6D727A]">0</strong>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
