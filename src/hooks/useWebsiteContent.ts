import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebsiteContentService } from "@/services/websiteContentService";
import { type components } from "@/types/api";

type NoticeCreate = components["schemas"]["NoticeCreate"];
type TenderCreate = components["schemas"]["TenderCreate"];
type EventCreate = components["schemas"]["EventCreate"];
type LeaderCreate = components["schemas"]["LeaderCreate"];

export function useNotices(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["notices", params],
    queryFn: () => WebsiteContentService.getNotices(params),
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NoticeCreate) => WebsiteContentService.createNotice(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useTenders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["tenders", params],
    queryFn: () => WebsiteContentService.getTenders(params),
  });
}

export function useCreateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TenderCreate) => WebsiteContentService.createTender(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenders"] }),
  });
}

export function useEvents(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => WebsiteContentService.getEvents(params),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventCreate) => WebsiteContentService.createEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useLeaders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["leaders", params],
    queryFn: () => WebsiteContentService.getLeaders(params),
  });
}

export function useCreateLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LeaderCreate) => WebsiteContentService.createLeader(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaders"] }),
  });
}

export function useDownloads(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["downloads", params],
    queryFn: () => WebsiteContentService.getDownloads(params),
  });
}

export function useCreateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => WebsiteContentService.createDownload(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["downloads"] }),
  });
}
