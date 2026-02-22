import api from "@/lib/axios";
import { type components } from "@/types/api";

type CityProfileResponse = components["schemas"]["CityProfileResponse"];
type CityProfileUpdate = components["schemas"]["CityProfileUpdate"];

export const CityProfileService = {
  async getLatest(): Promise<CityProfileResponse> {
    const response = await api.get<CityProfileResponse>("/api/city-profile");
    return response.data;
  },

  async update(data: CityProfileUpdate): Promise<CityProfileResponse> {
    const response = await api.put<CityProfileResponse>(
      "/api/city-profile",
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
