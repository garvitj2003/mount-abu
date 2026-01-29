"use client";

import {
  AvailableQuantityChart,
  MaterialBreakdown,
  MaterialUsageChart,
  StatCard,
} from "@/components/dashboard/citizen/DashboardWidgets";

export default function DashboardCitizenPage() {
  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header - Full Width, Bordered, No Rounded Corners */}
      <div className="flex flex-col gap-1 border-b border-[#D6D9DE] bg-white px-5 py-3">
        <h1 className="text-lg font-medium text-[#343434]">Dashboard</h1>
        <p className="text-xs font-normal text-[#343434] opacity-80">
          View and track all your applications and complaints at a glance.
        </p>
      </div>

      {/* Main Content Area with Padding */}
      <div className="flex flex-col gap-4 p-5">
        
        {/* Overview Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-medium text-[#343434]">Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              title="Total Applications"
              count="03"
              subtext="All Applications"
              iconType="applications"
              color="#0C83FF"
            />
            <StatCard
              title="Active Applications"
              count="03"
              subtext="Pending approvals"
              iconType="applications"
              color="#EF4444"
            />
            <StatCard
              title="Tokens Issued"
              count="05"
              subtext="Phase-wise + renovation"
              iconType="token"
              color="#059669"
            />
            <StatCard
              title="Complains"
              count="04"
              subtext="Total complaints"
              iconType="token"
              color="#F58646"
            />
            <StatCard
              title="Complaints Closed"
              count="03"
              subtext="Closed Complains"
              iconType="token"
              color="#059669"
            />
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-medium text-[#343434]">
            Token & Material Analysis
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            
            {/* Column 1: Material Usage Overview */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Material Usage Overview
              </h3>
              <div className="flex flex-1 items-center justify-center">
                <MaterialUsageChart />
              </div>
            </div>

            {/* Column 2: Available Quantity */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Available Quantity
              </h3>
              <div className="flex flex-1 items-center justify-center">
                <AvailableQuantityChart />
              </div>
            </div>

            {/* Column 3: Stacked Breakdown and Placeholder */}
            <div className="flex flex-col gap-4">
              {/* Top Material Breakdown */}
              <div className="flex flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-3 text-xs font-medium text-[#343434]">
                  Top Material Breakdown
                </h3>
                <MaterialBreakdown />
              </div>

              {/* Phase-wise Token Usage */}
              <div className="flex min-h-[80px] flex-1 flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-2 text-xs font-medium text-[#343434]">
                  Phase-wise Token Usage
                </h3>
                <div className="flex flex-1 items-center justify-center text-center text-[10px] font-light text-[#6D727A]">
                  Token Usage bar chart can be added here
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
