import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import { type components } from "@/types/api";

type UserFilter = components["schemas"]["UserFilter"];
type CreateUserRequest = components["schemas"]["CreateUserRequest"];
type ChangePasswordRequest = components["schemas"]["ChangePasswordRequest"];

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to manage and access the authenticated user's profile.
 * Replaces the need for manual syncing in Zustand.
 */
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => AuthService.getMe(),
    // Keep data fresh for 5 minutes, but keep it in cache longer
    staleTime: 5 * 60 * 1000, 
    // If the token is missing, this will fail with 401, which is handled by our interceptor
    retry: false, 
  });
}

export function useUsers(filter: UserFilter) {
  return useQuery({
    queryKey: ["users", filter],
    queryFn: () => UserService.getUsers(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.createUser(data),
    onSuccess: () => {
      // Invalidate both lists just in case
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => UserService.changePassword(data),
  });
}
