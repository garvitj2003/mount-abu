import { useQuery } from "@tanstack/react-query";
import { VehicleEntryService } from "@/services/vehicleEntryService";

export function useVehicleEntries(params?: {
  search?: string;
  vehicle_number?: string | string[];
  material_name?: string | string[];
  token_number?: string | string[];
  start_date?: string;
  end_date?: string;
  offset?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["vehicle-entries", params],
    queryFn: () => VehicleEntryService.getAllVehicleEntries(params),
    staleTime: 30 * 1000,
  });
}

export function useVehicleEntryDetail(id: number | null) {
  return useQuery({
    queryKey: ["vehicle-entry-detail", id],
    queryFn: () => VehicleEntryService.getVehicleEntryDetail(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
