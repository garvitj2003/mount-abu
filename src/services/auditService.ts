import api from "@/lib/axios";
import { type components } from "@/types/api";

type AuditLogListResponse = components["schemas"]["AuditLogListResponse"];

export const AuditService = {
  async getLogs(params: { 
    offset?: number; 
    skip?: number;
    limit?: number; 
    entity_type?: string; 
    action?: components["schemas"]["AuditAction"] 
  }): Promise<AuditLogListResponse> {
    const finalSkip = params.skip ?? params.offset ?? 0;
    const response = await api.get<AuditLogListResponse>("/api/audit", { 
      params: {
        ...params,
        skip: finalSkip,
        offset: finalSkip,
      }
    });
    return response.data;
  },
};
