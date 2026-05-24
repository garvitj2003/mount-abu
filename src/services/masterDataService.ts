import api from "@/lib/axios";
import { type components } from "@/types/api";

type WardCreate = components["schemas"]["WardCreate"];
type WardResponse = components["schemas"]["WardResponse"];
type DepartmentCreate = components["schemas"]["DepartmentCreate"];
type DepartmentResponse = components["schemas"]["DepartmentResponse"];
type RoleCreate = components["schemas"]["RoleCreate"];
type RoleResponse = components["schemas"]["RoleResponse"];
type ComplaintCategoryCreate = components["schemas"]["ComplaintCategoryCreate"];
type ComplaintCategoryResponse = components["schemas"]["ComplaintCategoryResponse"];
type MaterialCreate = components["schemas"]["MaterialCreate"];
type MaterialResponse = components["schemas"]["MaterialResponse"];
type UserSummary = components["schemas"]["UserSummary"];

type WardUpdate = components["schemas"]["WardUpdate"];
type DepartmentUpdate = components["schemas"]["DepartmentUpdate"];
type RoleUpdate = components["schemas"]["RoleUpdate"];
type ComplaintCategoryUpdate = components["schemas"]["ComplaintCategoryUpdate"];
type MaterialUpdate = components["schemas"]["MaterialUpdate"];

export const MasterDataService = {
  // Wards
  async getWards(): Promise<WardResponse[]> {
    const response = await api.get<WardResponse[]>("/api/master/wards");
    return response.data;
  },
  async createWard(data: WardCreate): Promise<WardResponse> {
    const response = await api.post<WardResponse>("/api/master/wards", data);
    return response.data;
  },
  async updateWard(wardId: number, data: WardUpdate): Promise<WardResponse> {
    const response = await api.put<WardResponse>(`/api/master/wards/${wardId}`, data);
    return response.data;
  },

  // Jens
  async getJens(): Promise<UserSummary[]> {
    const response = await api.get<UserSummary[]>("/api/master/jens");
    return response.data;
  },

  // Departments
  async getDepartments(): Promise<DepartmentResponse[]> {
    const response = await api.get<DepartmentResponse[]>("/api/master/departments");
    return response.data;
  },
  async createDepartment(data: DepartmentCreate): Promise<DepartmentResponse> {
    const response = await api.post<DepartmentResponse>("/api/master/departments", data);
    return response.data;
  },
  async updateDepartment(deptId: number, data: DepartmentUpdate): Promise<DepartmentResponse> {
    const response = await api.put<DepartmentResponse>(`/api/master/departments/${deptId}`, data);
    return response.data;
  },

  // Roles
  async getRoles(): Promise<RoleResponse[]> {
    const response = await api.get<RoleResponse[]>("/api/master/roles");
    return response.data;
  },
  async createRole(data: RoleCreate): Promise<RoleResponse> {
    const response = await api.post<RoleResponse>("/api/master/roles", data);
    return response.data;
  },
  async updateRole(roleId: number, data: RoleUpdate): Promise<RoleResponse> {
    const response = await api.put<RoleResponse>(`/api/master/roles/${roleId}`, data);
    return response.data;
  },

  // Complaint Categories
  async getComplaintCategories(): Promise<ComplaintCategoryResponse[]> {
    const response = await api.get<ComplaintCategoryResponse[]>("/api/master/complaint-categories");
    return response.data;
  },
  async createComplaintCategory(data: ComplaintCategoryCreate): Promise<ComplaintCategoryResponse> {
    const response = await api.post<ComplaintCategoryResponse>("/api/master/complaint-categories", data);
    return response.data;
  },
  async updateComplaintCategory(categoryId: number, data: ComplaintCategoryUpdate): Promise<ComplaintCategoryResponse> {
    const response = await api.put<ComplaintCategoryResponse>(`/api/master/complaint-categories/${categoryId}`, data);
    return response.data;
  },

  // Materials
  async getMaterials(): Promise<MaterialResponse[]> {
    const response = await api.get<MaterialResponse[]>("/api/master/materials");
    return response.data;
  },
  async createMaterial(data: MaterialCreate): Promise<MaterialResponse> {
    const response = await api.post<MaterialResponse>("/api/master/materials", data);
    return response.data;
  },
  async updateMaterial(materialId: number, data: MaterialUpdate): Promise<MaterialResponse> {
    const response = await api.put<MaterialResponse>(`/api/master/materials/${materialId}`, data);
    return response.data;
  },
};
