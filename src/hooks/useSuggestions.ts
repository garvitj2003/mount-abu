import { useQuery } from "@tanstack/react-query";
import { TokenService } from "@/services/tokenService";
import { VehicleEntryService } from "@/services/vehicleEntryService";
import { MasterDataService } from "@/services/masterDataService";

export function useTokenSuggestions(search: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["token-suggestions", search],
    queryFn: async () => {
      const tokens = await TokenService.getTokens({ search, limit: 20 });
      return Array.from(new Set(tokens.map((t: any) => t.token_number)));
    },
    enabled: options?.enabled !== false && search.length > 0,
    staleTime: 60 * 1000,
  });
}

export function useVehicleSuggestions(search: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["vehicle-suggestions", search],
    queryFn: async () => {
      const entries = await VehicleEntryService.getAllVehicleEntries({ search, limit: 50 });
      return Array.from(new Set(entries.map((e) => e.vehicle_number)));
    },
    enabled: options?.enabled !== false && search.length > 0,
    staleTime: 60 * 1000,
  });
}

export function useMaterialSuggestions(search: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["material-suggestions", search],
    queryFn: async () => {
      const materials = await MasterDataService.getMaterials();
      return materials
        .map((m) => m.name)
        .filter((name) => name.toLowerCase().includes(search.toLowerCase()));
    },
    enabled: options?.enabled !== false && search.length >= 0,
    staleTime: 5 * 60 * 1000,
  });
}
