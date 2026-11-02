import api from "@/lib/axios";

export interface NotificationItem {
  id: number;
  user_id: number;
  application_id?: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  unread_count: number;
  total: number;
}

export const NotificationService = {
  async getNotifications(limit: number = 20, offset: number = 0): Promise<NotificationListResponse> {
    const response = await api.get<NotificationListResponse>(`/api/notifications?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/api/notifications/mark-all-read");
    return response.data;
  },
};
