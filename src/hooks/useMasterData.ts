import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MasterDataService } from "@/services/masterDataService";
import { type components } from "@/types/api";

type WardCreate = components["schemas"]["WardCreate"];
type WardUpdate = components["schemas"]["WardUpdate"];
type DepartmentCreate = components["schemas"]["DepartmentCreate"];
type DepartmentUpdate = components["schemas"]["DepartmentUpdate"];
type RoleCreate = components["schemas"]["RoleCreate"];
type RoleUpdate = components["schemas"]["RoleUpdate"];
type ComplaintCategoryCreate = components["schemas"]["ComplaintCategoryCreate"];
type ComplaintCategoryUpdate = components["schemas"]["ComplaintCategoryUpdate"];
type MaterialCreate = components["schemas"]["MaterialCreate"];
type MaterialUpdate = components["schemas"]["MaterialUpdate"];

export function useWards(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["wards"],
    queryFn: () => MasterDataService.getWards(),
    staleTime: 60 * 60 * 1000,
    ...options,
  });
}

export function useCreateWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WardCreate) => MasterDataService.createWard(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wards"] }),
  });
}

export function useUpdateWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WardUpdate }) => 
      MasterDataService.updateWard(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wards"] }),
  });
}

export function useJens() {
  return useQuery({
    queryKey: ["jens"],
    queryFn: () => MasterDataService.getJens(),
    staleTime: 60 * 60 * 1000,
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

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentUpdate }) => 
      MasterDataService.updateDepartment(id, data),
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

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleUpdate }) => 
      MasterDataService.updateRole(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useComplaintCategories(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["complaint-categories"],
    queryFn: () => MasterDataService.getComplaintCategories(),
    staleTime: 60 * 60 * 1000,
    ...options,
  });
}

export function useCreateComplaintCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComplaintCategoryCreate) => MasterDataService.createComplaintCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaint-categories"] }),
  });
}

export function useUpdateComplaintCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ComplaintCategoryUpdate }) => 
      MasterDataService.updateComplaintCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaint-categories"] }),
  });
}

export function useMaterials(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["materials"],
    queryFn: () => MasterDataService.getMaterials(),
    staleTime: 60 * 60 * 1000,
    ...options,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MaterialCreate) => MasterDataService.createMaterial(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MaterialUpdate }) => 
      MasterDataService.updateMaterial(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
  });
}
