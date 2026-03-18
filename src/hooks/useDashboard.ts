import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboardService";

export function useCitizenDashboard() {
  return useQuery({
    queryKey: ["dashboard-citizen"],
    queryFn: () => DashboardService.getCitizenDashboard(),
  });
}

export function useAuthorityDashboard() {
  return useQuery({
    queryKey: ["dashboard-authority"],
    queryFn: () => DashboardService.getAuthorityDashboard(),
  });
}
