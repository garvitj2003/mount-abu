import { useQuery } from "@tanstack/react-query";
import { AuditService } from "@/services/auditService";
import { type components } from "@/types/api";

export function useAuditLogs(params: { 
  offset?: number; 
  limit?: number; 
  entity_type?: string; 
  action?: components["schemas"]["AuditAction"] 
}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => AuditService.getLogs(params),
  });
}
