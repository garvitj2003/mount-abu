import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboardService";

export function useCitizenDashboard() {
  return useQuery({
    queryKey: ["dashboard-citizen"],
    queryFn: () => DashboardService.getCitizenDashboard(),
  });
}

export function useAuthorityDashboard(filters?: { 
  days?: number; 
  department_id?: number; 
  ward_id?: number;
}) {
  return useQuery({
    queryKey: ["dashboard-authority", filters],
    queryFn: () => DashboardService.getAuthorityDashboard(filters),
  });
}
