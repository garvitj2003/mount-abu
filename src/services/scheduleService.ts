import api from "@/lib/axios";

export interface AvailableSlotItem {
  slot_id: number;
  name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked_count: number;
  available_capacity: number;
  is_available: boolean;
  is_blackout?: boolean;
  blackout_reason?: string | null;
  is_applicable_today?: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  is_full_day_blackout?: boolean;
  blackout_reason?: string | null;
  slots: AvailableSlotItem[];
}

export interface CapacityHeatmapSlot {
  slot_id: number;
  name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked_count: number;
  available_capacity: number;
  is_blackout: boolean;
  load_percentage: number;
}

export interface CapacityHeatmapDay {
  date: string;
  day_name: string;
  total_capacity: number;
  total_booked: number;
  total_available: number;
  overall_load_percentage: number;
  is_full_blackout: boolean;
  blackout_reason?: string | null;
  slots: CapacityHeatmapSlot[];
}

export interface CapacityHeatmapResponse {
  start_date: string;
  end_date: string;
  total_days: number;
  days: CapacityHeatmapDay[];
}


export interface VehicleScheduleCreate {
  token_id: number;
  slot_id: number;
  schedule_date: string; // YYYY-MM-DD
  vehicle_number: string;
  vehicle_type_id?: number;
  driver_name?: string;
  driver_mobile?: string;
}

export interface VehicleScheduleResponse {
  id: number;
  schedule_code: string;
  application_id: number;
  token_id: number;
  phase: number;
  user_id: number;
  slot_id: number;
  slot_name?: string;
  start_time?: string;
  end_time?: string;
  schedule_date: string;
  vehicle_number: string;
  vehicle_type_id?: number;
  vehicle_type_name?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
  created_at?: string;
  cancelled_at?: string;
  transport_code?: string;
  property_address?: string;
}

export interface TokenScheduleStatusResponse {
  has_active_schedule: boolean;
  active_schedule?: VehicleScheduleResponse;
}

export const ScheduleService = {
  async getAvailableSlots(date: string): Promise<AvailableSlotsResponse> {
    const response = await api.get<AvailableSlotsResponse>("/api/schedules/available-slots", {
      params: { date },
    });
    return response.data;
  },

  async bookSchedule(data: VehicleScheduleCreate): Promise<VehicleScheduleResponse> {
    const response = await api.post<VehicleScheduleResponse>("/api/schedules", data);
    return response.data;
  },

  async getCapacityHeatmap(startDate?: string, days: number = 14): Promise<CapacityHeatmapResponse> {
    const response = await api.get<CapacityHeatmapResponse>("/api/schedules/analytics/capacity-heatmap", {
      params: { start_date: startDate, days },
    });
    return response.data;
  },

  async getMySchedules(): Promise<VehicleScheduleResponse[]> {

    const response = await api.get<VehicleScheduleResponse[]>("/api/schedules/my-schedules");
    return response.data;
  },

  async getTokenScheduleStatus(tokenId: number): Promise<TokenScheduleStatusResponse> {
    const response = await api.get<TokenScheduleStatusResponse>(`/api/schedules/by-token/${tokenId}`);
    return response.data;
  },

  async getScheduleDetails(id: number): Promise<VehicleScheduleResponse> {
    const response = await api.get<VehicleScheduleResponse>(`/api/schedules/${id}`);
    return response.data;
  },

  async cancelSchedule(id: number): Promise<VehicleScheduleResponse> {
    const response = await api.post<VehicleScheduleResponse>(`/api/schedules/${id}/cancel`);
    return response.data;
  },
};
