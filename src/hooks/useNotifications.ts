import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService, NotificationListResponse } from "@/services/notificationService";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export function useNotifications(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationListResponse>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => NotificationService.getNotifications(30, 0),
    enabled,
    refetchInterval: enabled ? 20000 : false, // Poll every 20s if enabled
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.setQueryData<NotificationListResponse>(NOTIFICATIONS_QUERY_KEY, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          unread_count: 0,
          items: prev.items.map((item) => ({ ...item, is_read: true })),
        };
      });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  return {
    ...query,
    markAllAsRead: markAllReadMutation.mutate,
  };
}
