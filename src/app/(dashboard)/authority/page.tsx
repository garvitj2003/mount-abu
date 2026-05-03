"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { StatCard } from "@/components/common/stats/StatCard";
import { ApplicationsByStatusChart } from "@/components/common/charts/ApplicationsByStatusChart";
import { ComplaintsByCategoryChart } from "@/components/common/charts/ComplaintsByCategoryChart";
import { WardWiseActivityChart } from "@/components/common/charts/WardWiseActivityChart";
import { WardSummaryTable } from "@/components/common/charts/WardSummaryTable";
import { useAuthorityDashboard } from "@/hooks/useDashboard";
import { useUser } from "@/hooks/useUser";
import { useDepartments, useWards } from "@/hooks/useMasterData";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from "recharts";

const DAY_OPTIONS = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
  { label: "Last Year", value: 365 },
];

const STATUS_COLORS: Record<string, string> = {
  "PENDING": "#FFD648", // Yellow
  "SUBMITTED": "#3B83F6", // Blue
  "APPROVED": "#059669", // Green
  "FORWARDED": "#8B5CF6", // Purple
  "WITHHELD": "#F59E0B", // Orange
  "OBJECTED": "#F43F5E", // Rose/Pink
  "REJECTED": "#EF4444", // Red
  "TOKEN_GENERATED": "#10B981", // Emerald
  "WITHDRAWN": "#94A3B8", // Gray
  "IN_PROGRESS": "#0284C7", // Sky Blue
  "RESOLVED": "#059669", // Green
  "ACTIVE": "#059669", // Green
  "COMPLETED": "#15803D", // Dark Green
  "TERMINATED": "#B91C1C", // Dark Red
};

const KPI_ICONS: Record<string, string> = {
  "Total Applications": "applications",
  "Tokens Issued": "token",
  "Complaints": "token",
  "Approved": "applications",
  "Complaints Closed": "token",
  "Assigned": "applications",
  "Verified": "applications",
  "Total Entries": "token",
  "Received": "token",
  "Resolved": "token",
  "Tokens Generated": "token",
  "Utilized": "token",
};

const KPI_COLORS: Record<string, string> = {
  "Total Applications": "#0C83FF",
  "Approved": "#059669",
  "Tokens Issued": "#F35C86",
  "Complaints": "#F58646",
  "Complaints Closed": "#059669",
  "Assigned": "#0C83FF",
  "Verified": "#059669",
  "Pending": "#EF4444",
  "Total Entries": "#8B5CF6",
  "Received": "#3B83F6",
  "Resolved": "#10B981",
  "Tokens Generated": "#F35C86",
  "Utilized": "#F59E0B",
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default function DashboardAuthorityPage() {
  const { data: user } = useUser();
  const [filters, setFilters] = useState<{ days: number; department_id: number | null; ward_id: number | null }>({
    days: 7,
    department_id: null,
    ward_id: null
  });

  const { data: dashboard, isLoading, error } = useAuthorityDashboard({
    days: filters.days,
    department_id: filters.department_id || undefined,
    ward_id: filters.ward_id || undefined
  });

  const { data: departments } = useDepartments();
  const { data: wards } = useWards();

  const role = user?.role;

  const kpiData = useMemo(() => {
    if (!dashboard?.kpis) return [];
    return dashboard.kpis.map(kpi => ({
      title: kpi.label,
      count: kpi.value,
      subtext: (kpi.percent_change !== null && kpi.percent_change !== undefined) 
        ? `${kpi.percent_change > 0 ? '+' : ''}${kpi.percent_change}% vs last period` 
        : "vs last period",
      iconType: (KPI_ICONS[kpi.label] || "applications") as any,
      color: KPI_COLORS[kpi.label] || "#0C83FF",
      trend: (kpi.percent_change !== null && kpi.percent_change !== undefined) 
        ? { value: Math.abs(kpi.percent_change), isUp: kpi.percent_change > 0 } 
        : undefined
    }));
  }, [dashboard?.kpis]);

  const statusData = useMemo(() => {
    if (!dashboard?.application_status_breakdown) return [];
    return dashboard.application_status_breakdown.map(item => ({
      status: formatStatus(item.status),
      count: item.count,
      color: STATUS_COLORS[item.status] || "#94A3B8"
    }));
  }, [dashboard?.application_status_breakdown]);

  const wardActivityData = useMemo(() => {
    if (!dashboard?.ward_activity) return [];
    return dashboard.ward_activity.map(item => ({
      ward: item.ward_name,
      applications: item.applications,
      approved: item.approved,
      complaints: item.complaints,
      tokens: item.tokens_issued
    }));
  }, [dashboard?.ward_activity]);

  const wardSummaryData = useMemo(() => {
    if (!dashboard?.ward_activity) return [];
    return dashboard.ward_activity.map(item => ({
      ward: item.ward_name,
      applications: item.applications,
      approved: item.approved,
      tokensIssued: item.tokens_issued,
      complaints: item.complaints
    }));
  }, [dashboard?.ward_activity]);

  const complaintsByCategory = useMemo(() => {
    if (!dashboard?.complaints_by_category) return [];
    return dashboard.complaints_by_category.map(item => ({
      category: item.category_name,
      count: item.count
    }));
  }, [dashboard?.complaints_by_category]);

  if (isLoading) return (
    <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
    </div>
  );

  if (error || !dashboard) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F5F6F7]">
      <p className="text-lg font-medium text-[#EF4444]">Error loading dashboard data.</p>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-[#343434]">Reports & Analytics</h1>
          <p className="text-[12px] font-normal text-[#343434] opacity-80 leading-tight">
            Track role-specific performance and operational trends for {role?.replace('_', ' ').toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer">
            <Image src="/dashboard/icons/applications/download.svg" alt="" width={14} height={14} className="opacity-60" />
            Export PDF
          </button>
          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />
          <button className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer">
            <Image src="/dashboard/icons/applications/download.svg" alt="" width={14} height={14} className="invert brightness-0" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-6 pb-10">
          
          {/* Filters Row (Only for Super Admin/Dept heads) */}
          {(role === "SUPERADMIN" || role === "ADMIN") && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DropdownSelect
                  options={DAY_OPTIONS}
                  value={filters.days}
                  onChange={(val) => setFilters(prev => ({ ...prev, days: val as number }))}
                  triggerClassName="bg-white px-3 py-2 border-[#D6D9DE] h-auto"
                  className="w-[140px]"
                />
                
                <div className="h-6 w-px bg-[#C6CAD1]" />
                
                <DropdownSelect
                  options={[
                    { label: "All Department", value: "null" },
                    ...(departments?.map(d => ({ label: d.name, value: d.id })) || [])
                  ]}
                  value={filters.department_id === null ? "null" : filters.department_id}
                  onChange={(val) => setFilters(prev => ({ ...prev, department_id: val === "null" ? null : val as number }))}
                  placeholder="All Department"
                  triggerClassName="bg-white px-3 py-2 border-[#D6D9DE] h-auto"
                  className="w-[180px]"
                />

                <div className="h-6 w-px bg-[#C6CAD1]" />

                <DropdownSelect
                  options={[
                    { label: "All Wards", value: "null" },
                    ...(wards?.map(w => ({ label: w.name, value: w.id })) || [])
                  ]}
                  value={filters.ward_id === null ? "null" : filters.ward_id}
                  onChange={(val) => setFilters(prev => ({ ...prev, ward_id: val === "null" ? null : val as number }))}
                  placeholder="All Wards"
                  triggerClassName="bg-white px-3 py-2 border-[#D6D9DE] h-auto"
                  className="w-[160px]"
                />
              </div>
            </div>
          )}

          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {kpiData.map((kpi, idx) => (
              <StatCard 
                key={idx}
                title={kpi.title}
                count={kpi.count}
                subtext={kpi.subtext}
                iconType={kpi.iconType}
                color={kpi.color}
                trend={kpi.trend}
              />
            ))}
          </div>

          {/* Role-Specific Views */}
          
          {(role === "SUPERADMIN" || role === "ADMIN" || role === "COMMISSIONER") && (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="col-span-1 rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-2">
                    {role === "COMMISSIONER" ? "Resolution Status" : "Applications by Status"}
                  </h3>
                  <ApplicationsByStatusChart data={
                    role === "COMMISSIONER" 
                      ? (dashboard.complaint_resolution_status?.map(s => ({ status: formatStatus(s.status), count: s.count, color: STATUS_COLORS[s.status] || "#94A3B8" })) || [])
                      : statusData
                  } />
                </div>
                <div className="col-span-2 rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-2">Complaints by Category</h3>
                  <ComplaintsByCategoryChart data={complaintsByCategory} />
                </div>
              </div>

              {(role === "SUPERADMIN" || role === "ADMIN") && (
                <>
                  <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                    <h3 className="text-xs font-medium text-[#343434] mb-2">Ward-wise Activity Distribution</h3>
                    <WardWiseActivityChart data={wardActivityData} />
                  </div>
                  <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                    <h3 className="text-xs font-medium text-[#343434] mb-4">Ward Summary</h3>
                    <WardSummaryTable data={wardSummaryData} />
                  </div>
                </>
              )}

              {role === "COMMISSIONER" && dashboard.complaint_list && (
                <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-4">Recent Complaints</h3>
                  <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#D6D9DE] bg-gray-50 text-[11px] font-bold text-[#333333] opacity-70 uppercase">
                          <th className="p-3 border-r border-[#D6D9DE]">Complaint ID</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Applicant</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Category</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.complaint_list.map((c, i) => (
                          <tr key={i} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 text-[13px]">
                            <td className="p-3 font-medium text-[#0C83FF] underline border-r border-[#D6D9DE]">#{c.complaint_id}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{c.applicant_name}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{c.category_name}</td>
                            <td className="p-3">{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {role === "JEN" && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                <h3 className="text-xs font-medium text-[#343434] mb-2">Verification Status</h3>
                <ApplicationsByStatusChart data={
                  dashboard.verification_status?.map(s => ({ status: formatStatus(s.status), count: s.count, color: STATUS_COLORS[s.status] || "#94A3B8" })) || []
                } />
              </div>
              <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                <h3 className="text-xs font-medium text-[#343434] mb-2">Avg Verification Time Trend</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.avg_verification_time_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="period" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avg_hours" stroke="#0C83FF" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {dashboard.latest_applications && (
                <div className="col-span-full rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-4">Assigned Applications</h3>
                  <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#D6D9DE] bg-gray-50 text-[11px] font-bold text-[#333333] opacity-70 uppercase">
                          <th className="p-3 border-r border-[#D6D9DE]">ID</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Applicant</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Type</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.latest_applications.map((app, i) => (
                          <tr key={i} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 text-[13px]">
                            <td className="p-3 font-medium text-[#0C83FF] underline border-r border-[#D6D9DE]">#{app.application_id}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{app.applicant_name}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{app.application_type}</td>
                            <td className="p-3">{app.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === "NAKA_INCHARGE" && (
            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                <h3 className="text-xs font-medium text-[#343434] mb-2">Entries by Naka</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.entries_by_naka || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="naka_name" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} />
                      <Tooltip />
                      <Bar dataKey="entries" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {dashboard.vehicle_entry_list && (
                <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-4">Recent Entries</h3>
                  <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#D6D9DE] bg-gray-50 text-[11px] font-bold text-[#333333] opacity-70 uppercase">
                          <th className="p-3 border-r border-[#D6D9DE]">Vehicle</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Material</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Qty</th>
                          <th className="p-3">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.vehicle_entry_list.map((entry, i) => (
                          <tr key={i} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 text-[13px]">
                            <td className="p-3 font-medium border-r border-[#D6D9DE]">{entry.vehicle_number}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">
                              {"material_name" in entry ? entry.material_name : (entry as any).material_type}
                            </td>
                            <td className="p-3 border-r border-[#D6D9DE]">
                              {"quantity_brought" in entry ? entry.quantity_brought : (entry as any).quantity_entered}
                            </td>
                            <td className="p-3">{entry.entry_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === "NODAL_OFFICER" && (
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-2">Token Status</h3>
                  <ApplicationsByStatusChart data={
                    dashboard.token_status?.map(s => ({ status: formatStatus(s.status), count: s.count, color: STATUS_COLORS[s.status] || "#94A3B8" })) || []
                  } />
                </div>
                <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-2">Material Approved vs Used</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboard.material_approved_vs_used || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="material_name" tick={{fontSize: 10}} />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved_quantity" name="Approved" fill="#3B83F6" />
                        <Bar dataKey="used_quantity" name="Used" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              {dashboard.token_utilization_list && (
                <div className="rounded-xl border border-[#D6D9DE] bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-medium text-[#343434] mb-4">Token Utilization</h3>
                  <div className="w-full overflow-x-auto rounded-lg border border-[#D6D9DE]">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#D6D9DE] bg-gray-50 text-[11px] font-bold text-[#333333] opacity-70 uppercase">
                          <th className="p-3 border-r border-[#D6D9DE]">Applicant</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Phase</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Material</th>
                          <th className="p-3 border-r border-[#D6D9DE]">Permitted</th>
                          <th className="p-3">Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.token_utilization_list.map((row, i) => (
                          <tr key={i} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 text-[13px]">
                            <td className="p-3 font-medium border-r border-[#D6D9DE]">{row.applicant_name}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">Phase {row.phase}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{row.material_name}</td>
                            <td className="p-3 border-r border-[#D6D9DE]">{row.permitted_quantity}</td>
                            <td className="p-3">{row.used_quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
