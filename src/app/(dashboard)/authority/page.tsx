"use client";

import { useState } from "react";
import Image from "next/image";
import { StatCard } from "@/components/common/stats/StatCard";
import { ApplicationsByStatusChart } from "@/components/common/charts/ApplicationsByStatusChart";
import { ComplaintsByCategoryChart } from "@/components/common/charts/ComplaintsByCategoryChart";
import { WardWiseActivityChart } from "@/components/common/charts/WardWiseActivityChart";
import { WardSummaryTable } from "@/components/common/charts/WardSummaryTable";
import { MaterialUsageChart } from "@/components/common/charts/MaterialUsageChart";
import { AvailableQuantityChart } from "@/components/common/charts/AvailableQuantityChart";
import { MaterialBreakdown } from "@/components/common/charts/MaterialBreakdown";
import { PhaseTokenUsageChart } from "@/components/common/charts/PhaseTokenUsageChart";

const DUMMY_KPI_DATA = [
  { title: "Total Applications", count: 635, subtext: "vs last period", iconType: "applications", color: "#0C83FF", trend: { value: 12, isUp: true } },
  { title: "Approved", count: 320, subtext: "vs last period", iconType: "applications", color: "#059669", trend: { value: 12, isUp: true } },
  { title: "Tokens Issued", count: 285, subtext: "vs last period", iconType: "token", color: "#F35C86", trend: { value: 15, isUp: true } },
  { title: "Complains", count: 313, subtext: "vs last period", iconType: "token", color: "#F58646", trend: { value: 5, isUp: false } },
  { title: "Complaints Closed", count: 267, subtext: "vs last period", iconType: "token", color: "#059669", trend: { value: 18, isUp: true } },
];

const DUMMY_STATUS_DATA = [
  { status: "Approved", count: 320, color: "#059669" },
  { status: "Pending", count: 150, color: "#3B83F6" },
  { status: "Under Review", count: 100, color: "#FFD648" },
  { status: "Rejected", count: 65, color: "#EF4444" },
];

const DUMMY_COMPLAINT_DATA = [
  { category: "Sanitation", count: 20 },
  { category: "Engineering", count: 115 },
  { category: "Water Supply", count: 90 },
  { category: "Road Repair", count: 55 },
];

const DUMMY_WARD_ACTIVITY = [
  { ward: "Ward 1", applications: 65, approved: 52, complaints: 40, tokens: 30 },
  { ward: "Ward 2", applications: 65, approved: 32, complaints: 45, tokens: 30 },
  { ward: "Ward 3", applications: 65, approved: 52, complaints: 40, tokens: 30 },
  { ward: "Ward 4", applications: 65, approved: 52, complaints: 40, tokens: 30 },
];

const DUMMY_WARD_SUMMARY = [
  { ward: "Ward 1", applications: 45, approved: 32, tokensIssued: 28, complaints: 18 },
  { ward: "Ward 2", applications: 38, approved: 26, tokensIssued: 24, complaints: 22 },
  { ward: "Ward 3", applications: 52, approved: 41, tokensIssued: 38, complaints: 15 },
  { ward: "Ward 4", applications: 41, approved: 29, tokensIssued: 25, complaints: 19 },
];

const DUMMY_MATERIAL_USAGE = [
  { material_name: "Cement", unit: "bags", permitted_quantity: 500, used_quantity: 250, usage_percent: 50 },
  { material_name: "Bricks", unit: "nos", permitted_quantity: 400, used_quantity: 200, usage_percent: 50 },
  { material_name: "Steel", unit: "kg", permitted_quantity: 200, used_quantity: 100, usage_percent: 50 },
  { material_name: "Sand", unit: "bags", permitted_quantity: 800, used_quantity: 400, usage_percent: 50 },
];

const DUMMY_AVAILABLE_QUANTITY = [
  { material_name: "Cement", available_quantity: 250 },
  { material_name: "Sand", available_quantity: 400 },
  { material_name: "Bricks", available_quantity: 200 },
  { material_name: "Steel", available_quantity: 100 },
  { material_name: "Concrete", available_quantity: 150 },
  { material_name: "Others", available_quantity: 50 },
];

export default function DashboardAuthorityPage() {
  const [view, setView] = useState<"empty" | "main">("main");

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium text-[#343434]">Reports & Analytics</h1>
          <p className="text-xs font-normal text-[#343434] opacity-80">
            Track role-specific performance and operational trends.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-md border border-[#D6D9DE] bg-[#F5F6F7] p-1">
          <button
            onClick={() => setView("empty")}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
              view === "empty"
                ? "bg-white text-[#0C83FF] shadow-sm"
                : "text-[#343434] hover:bg-gray-200 opacity-60"
            }`}
          >
            Empty Dashboard
          </button>
          <button
            onClick={() => setView("main")}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-all ${
              view === "main"
                ? "bg-white text-[#0C83FF] shadow-sm"
                : "text-[#343434] hover:bg-gray-200 opacity-60"
            }`}
          >
            Main Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {view === "empty" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 opacity-40">
             <Image src="/dashboard/icons/dashboard.svg" alt="" width={64} height={64} className="grayscale" />
             <p className="text-sm font-medium text-[#343434]">No analytics data to display</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-10">
            
            {/* Filters Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 text-sm text-[#343434] cursor-pointer hover:bg-gray-50 transition-colors">
                  Last 7 Days
                  <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} />
                </div>
                <div className="h-6 w-px bg-[#C6CAD1]" />
                <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 text-sm text-[#343434] cursor-pointer hover:bg-gray-50 transition-colors">
                  All Department
                  <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} />
                </div>
                <div className="h-6 w-px bg-[#C6CAD1]" />
                <div className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 text-sm text-[#343434] cursor-pointer hover:bg-gray-50 transition-colors">
                  All Wards
                  <Image src="/dashboard/icons/applications/chevron-down.svg" alt="" width={10} height={6} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer">
                  <Image src="/dashboard/icons/applications/download.svg" alt="" width={14} height={14} className="opacity-60" />
                  Export PDF
                </button>
                <div className="h-6 w-px bg-[#C6CAD1]" />
                <button className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer">
                  <Image src="/dashboard/icons/applications/download.svg" alt="" width={14} height={14} className="invert brightness-0" />
                  Export Excel
                </button>
              </div>
            </div>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {DUMMY_KPI_DATA.map((kpi, idx) => (
                <StatCard 
                  key={idx}
                  title={kpi.title}
                  count={kpi.count}
                  subtext={kpi.subtext}
                  iconType={kpi.iconType as any}
                  color={kpi.color}
                  trend={kpi.trend}
                />
              ))}
            </div>

            {/* Row 1: Charts */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="col-span-1 rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                <h3 className="text-xs font-medium text-[#343434] mb-2">Applications by Status</h3>
                <ApplicationsByStatusChart data={DUMMY_STATUS_DATA} />
              </div>
              <div className="col-span-2 rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                <h3 className="text-xs font-medium text-[#343434] mb-2">Complaints by Category</h3>
                <ComplaintsByCategoryChart data={DUMMY_COMPLAINT_DATA} />
              </div>
            </div>

            {/* Row 2: Ward Distribution */}
            <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
              <h3 className="text-xs font-medium text-[#343434] mb-2">Ward-wise Activity Distribution</h3>
              <WardWiseActivityChart data={DUMMY_WARD_ACTIVITY} />
            </div>

            {/* Row 3: Ward Summary Table */}
            <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
              <h3 className="text-xs font-medium text-[#343434] mb-4">Ward Summary</h3>
              <WardSummaryTable data={DUMMY_WARD_SUMMARY} />
            </div>

            {/* Row 4: Secondary KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 mt-4">
              <StatCard title="Total Applications" count="03" subtext="All Applications" iconType="applications" color="#0C83FF" />
              <StatCard title="Active Applications" count="03" subtext="Pending approvals" iconType="applications" color="#EF4444" />
              <StatCard title="Tokens Issued" count="05" subtext="Phase-wise + renovation" iconType="token" color="#059669" />
              <StatCard title="Complains" count="04" subtext="Total complaints" iconType="token" color="#F58646" />
              <StatCard title="Complaints Closed" count="03" subtext="Closed Complains" iconType="token" color="#059669" />
            </div>

            {/* Row 5: Material Analysis */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xs font-medium text-[#343434]">Material Usage Overview</h3>
                <div className="flex flex-1 items-center justify-center min-h-[220px]">
                  <MaterialUsageChart data={DUMMY_MATERIAL_USAGE} />
                </div>
              </div>

              <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-xs font-medium text-[#343434]">Available Quantity</h3>
                <div className="flex flex-1 items-center justify-center min-h-[220px]">
                  <AvailableQuantityChart data={DUMMY_AVAILABLE_QUANTITY} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-xs font-medium text-[#343434]">Top Material Breakdown</h3>
                  <MaterialBreakdown data={DUMMY_MATERIAL_USAGE} />
                </div>

                <div className="flex min-h-[180px] flex-1 flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-sm">
                  <h3 className="mb-4 text-xs font-medium text-[#343434]">Phase-wise Token Usage</h3>
                  <div className="flex flex-1 items-center justify-center">
                    <PhaseTokenUsageChart data={[]} /> {/* Empty for placeholder check */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
