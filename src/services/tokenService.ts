import api from "@/lib/axios";
import { type components } from "@/types/api";

type ConstructionTokenResponse = components["schemas"]["TokenResponse"];

export const TokenService = {
  async getTokens(params: { 
    offset?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
    citizen_user_id?: number 
  }): Promise<ConstructionTokenResponse[]> {
    const response = await api.get<ConstructionTokenResponse[]>("/api/tokens", { params });
    return response.data;
  },

  async getTokenByCode(transportCode: string): Promise<components["schemas"]["TokenDetailResponse"]> {
    const response = await api.get<components["schemas"]["TokenDetailResponse"]>(`/api/tokens/${transportCode}`);
    return response.data;
  },
};
