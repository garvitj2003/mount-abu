import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/applicationService";
import { ComplaintService } from "@/services/complaintService";

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: () => ApplicationService.getMaterials(),
    staleTime: 60 * 60 * 1000, // Materials change rarely, keep for 1 hour
  });
}

export function useWards() {
  return useQuery({
    queryKey: ["wards"],
    queryFn: () => ApplicationService.getWards(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => ApplicationService.getDepartments(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useComplaintCategories() {
  return useQuery({
    queryKey: ["complaint-categories"],
    queryFn: () => ComplaintService.getCategories(),
    staleTime: 60 * 60 * 1000,
  });
}
