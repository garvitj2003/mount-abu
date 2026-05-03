import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebsiteContentService } from "@/services/websiteContentService";
import { type components } from "@/types/api";

type NoticeCreate = components["schemas"]["Body_create_notice_api_notices_post"];
type NoticeUpdate = components["schemas"]["Body_update_notice_api_notices__notice_id__put"];
type TenderCreate = components["schemas"]["Body_create_tender_api_tenders_post"];
type TenderUpdate = components["schemas"]["Body_update_tender_api_tenders__tender_id__put"];
type EventCreate = components["schemas"]["Body_create_event_api_events_post"];
type EventUpdate = components["schemas"]["Body_update_event_api_events__event_id__put"];
type LeaderCreate = components["schemas"]["Body_create_leader_api_leaders_post"];
type LeaderUpdate = components["schemas"]["Body_update_leader_api_leaders__leader_id__put"];
type ContactDiaryCreate = components["schemas"]["ContactDiaryCreate"];
type ContactDiaryUpdate = components["schemas"]["ContactDiaryUpdate"];
type DownloadUpdate = components["schemas"]["DownloadUpdate"];

// Notices
export function useNotices(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["notices", params],
    queryFn: () => WebsiteContentService.getNotices(params),
  });
}

export function useNotice(id: number) {
  return useQuery({
    queryKey: ["notices", id],
    queryFn: () => WebsiteContentService.getNotice(id),
    enabled: !!id,
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => WebsiteContentService.createNotice(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoticeUpdate | FormData }) => 
      WebsiteContentService.updateNotice(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteNotice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
}

// Tenders
export function useTenders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["tenders", params],
    queryFn: () => WebsiteContentService.getTenders(params),
  });
}

export function useCreateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => WebsiteContentService.createTender(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenders"] }),
  });
}

export function useUpdateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TenderUpdate | FormData }) => 
      WebsiteContentService.updateTender(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenders"] }),
  });
}

export function useDeleteTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteTender(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenders"] }),
  });
}

// Events
export function useEvents(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => WebsiteContentService.getEvents(params),
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => WebsiteContentService.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => WebsiteContentService.createEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventUpdate | FormData }) => 
      WebsiteContentService.updateEvent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

// Leaders
export function useLeaders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["leaders", params],
    queryFn: () => WebsiteContentService.getLeaders(params),
  });
}

export function useCreateLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => WebsiteContentService.createLeader(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaders"] }),
  });
}

export function useUpdateLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeaderUpdate | FormData }) => 
      WebsiteContentService.updateLeader(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaders"] }),
  });
}

export function useDeleteLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteLeader(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leaders"] }),
  });
}

// Downloads
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

export function useUpdateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DownloadUpdate }) => 
      WebsiteContentService.updateDownload(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["downloads"] }),
  });
}

export function useDeleteDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteDownload(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["downloads"] }),
  });
}

// Contact Diary
export function useContacts(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => WebsiteContentService.getContacts(params),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactDiaryCreate) => WebsiteContentService.createContact(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactDiaryUpdate }) => 
      WebsiteContentService.updateContact(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => WebsiteContentService.deleteContact(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });
}
