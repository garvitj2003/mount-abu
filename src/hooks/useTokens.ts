import { useQuery } from "@tanstack/react-query";
import { TokenService } from "@/services/tokenService";
import { type components } from "@/types/api";

type ConstructionToken = components["schemas"]["backend__schemas__response__application__TokenResponse"];

export function useTokens(params: { offset?: number; limit?: number; search?: string; citizen_user_id?: number }) {
  return useQuery<ConstructionToken[]>({
    queryKey: ["tokens", params],
    queryFn: () => TokenService.getTokens(params),
  });
}

export function useTokenDetail(transportCode: string) {
  return useQuery<components["schemas"]["TokenDetailResponse"]>({
    queryKey: ["token", transportCode],
    queryFn: () => TokenService.getTokenByCode(transportCode),
    enabled: !!transportCode,
  });
}
