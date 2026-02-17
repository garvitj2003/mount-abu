import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MasterDataService } from "@/services/masterDataService";
import { type components } from "@/types/api";

type WardCreate = components["schemas"]["WardCreate"];
type DepartmentCreate = components["schemas"]["DepartmentCreate"];
type RoleCreate = components["schemas"]["RoleCreate"];
type ComplaintCategoryCreate = components["schemas"]["ComplaintCategoryCreate"];
type MaterialCreate = components["schemas"]["MaterialCreate"];

export function useWards() {
  return useQuery({
    queryKey: ["wards"],
    queryFn: () => MasterDataService.getWards(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WardCreate) => MasterDataService.createWard(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wards"] }),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => MasterDataService.getDepartments(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentCreate) => MasterDataService.createDepartment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => MasterDataService.getRoles(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleCreate) => MasterDataService.createRole(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useComplaintCategories() {
  return useQuery({
    queryKey: ["complaint-categories"],
    queryFn: () => MasterDataService.getComplaintCategories(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateComplaintCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComplaintCategoryCreate) => MasterDataService.createComplaintCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaint-categories"] }),
  });
}

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: () => MasterDataService.getMaterials(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MaterialCreate) => MasterDataService.createMaterial(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}
