import api from "@/lib/axios";
import { type components } from "@/types/api";

type CitizenDashboardResponse = components["schemas"]["CitizenDashboardResponse"];
type AuthorityDashboardResponse = components["schemas"]["AuthorityDashboardResponse"];

export const DashboardService = {
  async getCitizenDashboard(): Promise<CitizenDashboardResponse> {
    const response = await api.get<CitizenDashboardResponse>("/api/dashboard/citizen");
    return response.data;
  },

  async getAuthorityDashboard(filters?: { 
    days?: number; 
    department_id?: number; 
    ward_id?: number;
  }): Promise<AuthorityDashboardResponse> {
    const params = new URLSearchParams();
    if (filters?.days) params.append("days", filters.days.toString());
    if (filters?.department_id) params.append("department_id", filters.department_id.toString());
    if (filters?.ward_id) params.append("ward_id", filters.ward_id.toString());

    const response = await api.get<AuthorityDashboardResponse>(`/api/dashboard/authority?${params.toString()}`);
    return response.data;
  },
};
