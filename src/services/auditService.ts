import api from "@/lib/axios";
import { type components } from "@/types/api";

type AuditLogListResponse = components["schemas"]["AuditLogListResponse"];

export const AuditService = {
  async getLogs(params: { 
    offset?: number; 
    limit?: number; 
    entity_type?: string; 
    action?: components["schemas"]["AuditAction"] 
  }): Promise<AuditLogListResponse> {
    const response = await api.get<AuditLogListResponse>("/api/audit", { params });
    return response.data;
  },
};
