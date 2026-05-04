import api from "@/lib/axios";
import { type components } from "@/types/api";

type CityProfileResponse = components["schemas"]["CityProfileResponse"];
type CityProfileCreate = components["schemas"]["CityProfileCreate"];

export const CityProfileService = {
  async getLatest(): Promise<CityProfileResponse> {
    const response = await api.get<CityProfileResponse>("/api/city-profile/");
    return response.data;
  },

  async update(id: number, data: CityProfileCreate): Promise<CityProfileResponse> {
    const response = await api.patch<CityProfileResponse>(
      `/api/city-profile/${id}`,
      data,
    );
    return response.data;
  },

  async getHistory(): Promise<CityProfileResponse[]> {
    const response = await api.get<CityProfileResponse[]>(
      "/api/city-profile/history",
    );
    return response.data;
  },
};
