import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleService, type VehicleScheduleCreate } from "@/services/scheduleService";

export function useAvailableSlots(dateStr: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["available-slots", dateStr],
    queryFn: () => ScheduleService.getAvailableSlots(dateStr),
    enabled: !!dateStr && (options?.enabled !== false),
    staleTime: 30 * 1000, // 30s freshness
  });
}

export function useMySchedules() {
  return useQuery({
    queryKey: ["my-schedules"],
    queryFn: () => ScheduleService.getMySchedules(),
    staleTime: 60 * 1000,
  });
}

export function useTokenScheduleStatus(tokenId?: number) {
  return useQuery({
    queryKey: ["token-schedule-status", tokenId],
    queryFn: () => (tokenId ? ScheduleService.getTokenScheduleStatus(tokenId) : null),
    enabled: !!tokenId,
    staleTime: 30 * 1000,
  });
}

export function useBookSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleScheduleCreate) => ScheduleService.bookSchedule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["token-schedule-status", variables.token_id] });
      queryClient.invalidateQueries({ queryKey: ["token-detail"] });
    },
  });
}

export function useCancelSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ScheduleService.cancelSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["token-schedule-status"] });
      queryClient.invalidateQueries({ queryKey: ["token-detail"] });
      queryClient.invalidateQueries({ queryKey: ["capacity-heatmap"] });
    },
  });
}

export function useCapacityHeatmap(startDate?: string, days: number = 14) {
  return useQuery({
    queryKey: ["capacity-heatmap", startDate, days],
    queryFn: () => ScheduleService.getCapacityHeatmap(startDate, days),
    staleTime: 30 * 1000,
  });
}

