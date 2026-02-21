import api from "@/lib/axios";
import { type components } from "@/types/api";

type ComplaintCreateRequest = components["schemas"]["ComplaintCreateRequest"];
type ComplaintResponse = components["schemas"]["ComplaintResponse"];
type ComplaintCategoryResponse = components["schemas"]["ComplaintCategoryResponse"];
type ComplaintListResponse = components["schemas"]["ComplaintListResponse"];
type ComplaintStatus = components["schemas"]["ComplaintStatus"];

export const ComplaintService = {
  async getCategories(): Promise<ComplaintCategoryResponse[]> {
    const response = await api.get<ComplaintCategoryResponse[]>("/api/master/complaint-categories");
    return response.data;
  },

  async getMyComplaints(params: { status?: ComplaintStatus | null; offset?: number; limit?: number }): Promise<ComplaintListResponse> {
    const response = await api.get<ComplaintListResponse>("/api/complaints/my", { params });
    return response.data;
  },

  async getAllComplaints(params: {
    status?: ComplaintStatus | null;
    ward_id?: number | null;
    department_id?: number | null;
    category_id?: number | null;
    offset?: number;
    limit?: number;
  }): Promise<ComplaintListResponse> {
    const response = await api.get<ComplaintListResponse>("/api/complaints", { params });
    return response.data;
  },

  async createComplaint(data: ComplaintCreateRequest): Promise<ComplaintResponse> {
    const response = await api.post<ComplaintResponse>("/api/complaints", data);
    return response.data;
  },

  async getComplaint(id: number): Promise<ComplaintResponse> {
    const response = await api.get<ComplaintResponse>(`/api/complaints/${id}`);
    return response.data;
  },

  async uploadMedia(complaintId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "COMPLAINT");
    formData.append("entity_id", complaintId.toString());

    const response = await api.post("/api/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};
