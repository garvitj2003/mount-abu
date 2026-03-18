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

export function useAllComplaints(params: {
  status?: ComplaintStatus | null;
  ward_id?: number | null;
  department_id?: number | null;
  category_id?: number | null;
  offset?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["complaints", "all", params],
    queryFn: () => ComplaintService.getAllComplaints(params),
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
