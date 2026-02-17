import { useQuery } from "@tanstack/react-query";
import { ComplaintService } from "@/services/complaintService";
import { type components } from "@/types/api";

type ComplaintStatus = components["schemas"]["ComplaintStatus"];

export function useMyComplaints(params: { status?: ComplaintStatus | null; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ["complaints", "my", params],
    queryFn: () => ComplaintService.getMyComplaints(params),
    staleTime: 30 * 1000,
  });
}

export function useComplaint(id: number | null) {
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: () => ComplaintService.getComplaint(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
