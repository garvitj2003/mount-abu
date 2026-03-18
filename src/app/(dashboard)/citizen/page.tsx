"use client";

import { StatCard } from "@/components/common/stats/StatCard";
import { MaterialUsageChart } from "@/components/common/charts/MaterialUsageChart";
import { AvailableQuantityChart } from "@/components/common/charts/AvailableQuantityChart";
import { MaterialBreakdown } from "@/components/common/charts/MaterialBreakdown";
import { PhaseTokenUsageChart } from "@/components/common/charts/PhaseTokenUsageChart";
import { useCitizenDashboard } from "@/hooks/useDashboard";

export default function DashboardCitizenPage() {
  const { data, isLoading } = useCitizenDashboard();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-[#D6D9DE] bg-white px-5 py-3">
        <h1 className="text-lg font-medium text-[#343434]">Dashboard</h1>
        <p className="text-xs font-normal text-[#343434] opacity-80">
          View and track all your applications and complaints at a glance.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto">
        
        {/* Overview Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-medium text-[#343434]">Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              title="Total Applications"
              count={overview?.total_applications || 0}
              subtext="All Applications"
              iconType="applications"
              color="#0C83FF"
            />
            <StatCard
              title="Active Applications"
              count={overview?.active_applications || 0}
              subtext="Pending approvals"
              iconType="applications"
              color="#EF4444"
            />
            <StatCard
              title="Tokens Issued"
              count={overview?.tokens_issued || 0}
              subtext="Phase-wise + renovation"
              iconType="token"
              color="#059669"
            />
            <StatCard
              title="Complaints"
              count={overview?.total_complaints || 0}
              subtext="Total complaints"
              iconType="token"
              color="#F58646"
            />
            <StatCard
              title="Complaints Closed"
              count={overview?.closed_complaints || 0}
              subtext="Closed Complains"
              iconType="token"
              color="#059669"
            />
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex flex-col gap-3 pb-10">
          <h2 className="text-base font-medium text-[#343434]">
            Token & Material Analysis
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            
            {/* Column 1: Material Usage Overview */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Material Usage Overview
              </h3>
              <div className="flex flex-1 items-center justify-center min-h-[220px]">
                <MaterialUsageChart data={data?.material_usage || []} />
              </div>
            </div>

            {/* Column 2: Available Quantity */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Available Quantity
              </h3>
              <div className="flex flex-1 items-center justify-center min-h-[220px]">
                <AvailableQuantityChart data={data?.available_quantity || []} />
              </div>
            </div>

            {/* Column 3: Breakdown & Token Usage */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-3 text-xs font-medium text-[#343434]">
                  Top Material Breakdown
                </h3>
                <MaterialBreakdown data={data?.material_usage || []} />
              </div>

              <div className="flex min-h-[180px] flex-1 flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-4 text-xs font-medium text-[#343434]">
                  Phase-wise Token Usage
                </h3>
                <div className="flex flex-1 items-center justify-center">
                  <PhaseTokenUsageChart data={data?.phase_token_usage || []} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
