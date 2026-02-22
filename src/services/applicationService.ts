import api from "@/lib/axios";
import { type components } from "@/types/api";

type ApplicationCreate = components["schemas"]["ApplicationCreate"];
type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type MaterialResponse = components["schemas"]["MaterialResponse"];
type WardResponse = components["schemas"]["WardResponse"];
type DepartmentResponse = components["schemas"]["DepartmentResponse"];
type ApplicationMaterialRequirements =
  components["schemas"]["ApplicationMaterialRequirements"];
type ApplicationFlags = components["schemas"]["ApplicationFlags"];

export const ApplicationService = {
  // Master Data
  async getMaterials(): Promise<MaterialResponse[]> {
    const response = await api.get<MaterialResponse[]>("/api/master/materials");
    return response.data;
  },

  async getWards(): Promise<WardResponse[]> {
    const response = await api.get<WardResponse[]>("/api/master/wards");
    return response.data;
  },

  async getDepartments(): Promise<DepartmentResponse[]> {
    const response = await api.get<DepartmentResponse[]>(
      "/api/master/departments",
    );
    return response.data;
  },

  // Application Flow
  async getApplications(params: {
    flag: ApplicationFlags;
    citizen_user_id?: number;
    offset?: number;
    limit?: number;
  }): Promise<ApplicationResponse[]> {
    const response = await api.get<ApplicationResponse[]>("/api/applications", {
      params,
    });
    return response.data;
  },

  async getApplication(id: number): Promise<ApplicationResponse> {
    const response = await api.get<ApplicationResponse>(`/api/applications/${id}`);
    return response.data;
  },

  async createApplication(
    data: ApplicationCreate,
  ): Promise<ApplicationResponse> {
    const response = await api.post<ApplicationResponse>(
      "/api/applications",
      data,
    );
    return response.data;
  },

  async uploadDocument(
    applicationId: number,
    file: File,
    type: string,
  ): Promise<any> {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("document_type", type);

    const response = await api.post(
      `/api/applications/${applicationId}/document`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async addMaterials(
    applicationId: number,
    materials: ApplicationMaterialRequirements[],
  ): Promise<any> {
    const response = await api.post(
      `/api/applications/${applicationId}/materials`,
      materials,
    );
    return response.data;
  },

  async submitApplication(applicationId: number): Promise<any> {
    const response = await api.put(`/api/applications/${applicationId}/submit`);
    return response.data;
  },

  async deleteApplication(applicationId: number): Promise<any> {
    const response = await api.delete(`/api/applications/${applicationId}`);
    return response.data;
  },
};
