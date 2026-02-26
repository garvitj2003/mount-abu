import api from "@/lib/axios";
import { type components } from "@/types/api";

type CitizenDashboardResponse = components["schemas"]["CitizenDashboardResponse"];

export const DashboardService = {
  async getCitizenDashboard(): Promise<CitizenDashboardResponse> {
    const response = await api.get<CitizenDashboardResponse>("/api/dashboard/citizen");
    return response.data;
  },
};
