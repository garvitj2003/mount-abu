import api from "@/lib/axios";
import { type components } from "@/types/api";

type CitizenDashboardResponse = components["schemas"]["CitizenDashboardResponse"];
type AuthorityDashboardResponse = components["schemas"]["AuthorityDashboardResponse"];

export const DashboardService = {
  async getCitizenDashboard(): Promise<CitizenDashboardResponse> {
    const response = await api.get<CitizenDashboardResponse>("/api/dashboard/citizen");
    return response.data;
  },

  async getAuthorityDashboard(): Promise<AuthorityDashboardResponse> {
    const response = await api.get<AuthorityDashboardResponse>("/api/dashboard/authority");
    return response.data;
  },
};
