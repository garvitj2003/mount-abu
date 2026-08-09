import api from "@/lib/axios";
import { type components } from "@/types/api";

type AuthorityVehicleEntryResponse = components["schemas"]["AuthorityVehicleEntryResponse"];
type VehicleEntryDetailResponse = components["schemas"]["VehicleEntryDetailResponse"];

export const VehicleEntryService = {
  async getAllVehicleEntries(params?: {
    search?: string;
    vehicle_number?: string | string[];
    material_name?: string | string[];
    token_number?: string | string[];
    start_date?: string;
    end_date?: string;
    offset?: number;
    limit?: number;
  }): Promise<components["schemas"]["VehicleEntryListResponse"]> {
    const response = await api.get<components["schemas"]["VehicleEntryListResponse"]>("/api/authority/vehicle-entries", {
      params,
    });
    return response.data;
  },

  async getVehicleEntryDetail(id: number): Promise<VehicleEntryDetailResponse> {
    const response = await api.get<VehicleEntryDetailResponse>(`/api/vehicle-entries/${id}`);
    return response.data;
  },
};
