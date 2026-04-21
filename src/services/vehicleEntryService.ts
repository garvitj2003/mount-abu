import api from "@/lib/axios";
import { type components } from "@/types/api";

type AuthorityVehicleEntryResponse = components["schemas"]["AuthorityVehicleEntryResponse"];
type VehicleEntryDetailResponse = components["schemas"]["VehicleEntryDetailResponse"];

export const VehicleEntryService = {
  async getAllVehicleEntries(): Promise<AuthorityVehicleEntryResponse[]> {
    const response = await api.get<AuthorityVehicleEntryResponse[]>("/api/authority/vehicle-entries");
    return response.data;
  },

  async getVehicleEntryDetail(id: number): Promise<VehicleEntryDetailResponse> {
    const response = await api.get<VehicleEntryDetailResponse>(`/api/vehicle-entries/${id}`);
    return response.data;
  },
};
