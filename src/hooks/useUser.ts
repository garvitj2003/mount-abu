import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/authService";

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
