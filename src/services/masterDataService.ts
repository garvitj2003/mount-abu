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

  // Vehicle Slots
  async getSlots(): Promise<SlotDefinitionResponse[]> {
    const response = await api.get<SlotDefinitionResponse[]>("/api/master/slots");
    return response.data;
  },
  async createSlot(data: SlotDefinitionCreate): Promise<SlotDefinitionResponse> {
    const response = await api.post<SlotDefinitionResponse>("/api/master/slots", data);
    return response.data;
  },
  async updateSlot(slotId: number, data: SlotDefinitionUpdate): Promise<SlotDefinitionResponse> {
    const response = await api.put<SlotDefinitionResponse>(`/api/master/slots/${slotId}`, data);
    return response.data;
  },
  async deleteSlot(slotId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/master/slots/${slotId}`);
    return response.data;
  },

  // Vehicle Types
  async getVehicleTypes(): Promise<VehicleTypeResponse[]> {
    const response = await api.get<VehicleTypeResponse[]>("/api/master/vehicle-types");
    return response.data;
  },
  async createVehicleType(data: VehicleTypeCreate): Promise<VehicleTypeResponse> {
    const response = await api.post<VehicleTypeResponse>("/api/master/vehicle-types", data);
    return response.data;
  },
  async updateVehicleType(typeId: number, data: VehicleTypeUpdate): Promise<VehicleTypeResponse> {
    const response = await api.put<VehicleTypeResponse>(`/api/master/vehicle-types/${typeId}`, data);
    return response.data;
  },
  async deleteVehicleType(typeId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/master/vehicle-types/${typeId}`);
    return response.data;
  },

  // Schedule Blackouts
  async getBlackouts(): Promise<ScheduleBlackoutResponse[]> {
    const response = await api.get<ScheduleBlackoutResponse[]>("/api/master/blackouts");
    return response.data;
  },
  async createBlackout(data: ScheduleBlackoutCreate): Promise<ScheduleBlackoutResponse> {
    const response = await api.post<ScheduleBlackoutResponse>("/api/master/blackouts", data);
    return response.data;
  },
  async updateBlackout(blackoutId: number, data: ScheduleBlackoutUpdate): Promise<ScheduleBlackoutResponse> {
    const response = await api.put<ScheduleBlackoutResponse>(`/api/master/blackouts/${blackoutId}`, data);
    return response.data;
  },
  async deleteBlackout(blackoutId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/master/blackouts/${blackoutId}`);
    return response.data;
  },
};

export interface SlotDefinitionResponse {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  applicable_days: string;
  grace_period_minutes: number;
  is_active: boolean;
  created_at?: string;
}

export interface SlotDefinitionCreate {
  name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  applicable_days?: string;
  grace_period_minutes?: number;
  is_active?: boolean;
}

export interface SlotDefinitionUpdate {
  name?: string;
  start_time?: string;
  end_time?: string;
  max_capacity?: number;
  applicable_days?: string;
  grace_period_minutes?: number;
  is_active?: boolean;
}

export interface VehicleTypeResponse {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at?: string;
}

export interface VehicleTypeCreate {
  name: string;
  code: string;
  is_active?: boolean;
}

export interface VehicleTypeUpdate {
  name?: string;
  code?: string;
  is_active?: boolean;
}

export interface ScheduleBlackoutResponse {
  id: number;
  blackout_date: string;
  reason: string;
  is_full_day: boolean;
  slot_id?: number | null;
  slot_name?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface ScheduleBlackoutCreate {
  blackout_date: string;
  reason: string;
  is_full_day?: boolean;
  slot_id?: number | null;
  is_active?: boolean;
}

export interface ScheduleBlackoutUpdate {
  blackout_date?: string;
  reason?: string;
  is_full_day?: boolean;
  slot_id?: number | null;
  is_active?: boolean;
}


