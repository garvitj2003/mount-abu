import api from "@/lib/axios";
import { type components } from "@/types/api";

type UserResponse = components["schemas"]["UserResponse"];
type UserFilter = components["schemas"]["UserFilter"];
type CreateUserRequest = components["schemas"]["CreateUserRequest"];
type ChangePasswordRequest = components["schemas"]["ChangePasswordRequest"];

export const UserService = {
  async getUsers(filter: UserFilter): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>("/api/users", {
      params: { filter },
    });
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>("/api/superadmin/users", data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<any> {
    const response = await api.post("/superadmin/change-password", data);
    return response.data;
  }
};
