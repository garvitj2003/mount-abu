import { useQuery } from "@tanstack/react-query";
import { TokenService } from "@/services/tokenService";

export function useTokens(params: { offset?: number; limit?: number; search?: string; citizen_user_id?: number }) {
  return useQuery({
    queryKey: ["tokens", params],
    queryFn: () => TokenService.getTokens(params),
  });
}

export function useTokenDetail(transportCode: string) {
  return useQuery({
    queryKey: ["token", transportCode],
    queryFn: () => TokenService.getTokenByCode(transportCode),
    enabled: !!transportCode,
  });
}
