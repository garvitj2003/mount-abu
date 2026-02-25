import api from "@/lib/axios";
import { type components } from "@/types/api";

type NoticeCreate = components["schemas"]["NoticeCreate"];
type NoticeResponse = components["schemas"]["NoticeResponse"];
type NoticesListResponse = components["schemas"]["NoticesListResponse"];

type TenderCreate = components["schemas"]["TenderCreate"];
type TenderResponse = components["schemas"]["TenderResponse"];
type TendersListResponse = components["schemas"]["TendersListResponse"];

type EventCreate = components["schemas"]["EventCreate"];
type EventResponse = components["schemas"]["EventResponse"];
type EventsListResponse = components["schemas"]["EventsListResponse"];

type LeaderCreate = components["schemas"]["LeaderCreate"];
type LeaderResponse = components["schemas"]["LeaderResponse"];
type LeadersListResponse = components["schemas"]["LeadersListResponse"];

type DownloadResponse = components["schemas"]["DownloadResponse"];
type DownloadsListResponse = components["schemas"]["DownloadsListResponse"];

export const WebsiteContentService = {
  // Notices
  async getNotices(params?: { limit?: number; offset?: number }): Promise<NoticesListResponse> {
    const response = await api.get<NoticesListResponse>("/api/notices", { params });
    return response.data;
  },
  async createNotice(data: NoticeCreate): Promise<NoticeResponse> {
    const response = await api.post<NoticeResponse>("/api/notices", data);
    return response.data;
  },

  // Tenders
  async getTenders(params?: { limit?: number; offset?: number }): Promise<TendersListResponse> {
    const response = await api.get<TendersListResponse>("/api/tenders", { params });
    return response.data;
  },
  async createTender(data: TenderCreate): Promise<TenderResponse> {
    const response = await api.post<TenderResponse>("/api/tenders", data);
    return response.data;
  },

  // Events
  async getEvents(params?: { limit?: number; offset?: number }): Promise<EventsListResponse> {
    const response = await api.get<EventsListResponse>("/api/events", { params });
    return response.data;
  },
  async createEvent(data: EventCreate): Promise<EventResponse> {
    const response = await api.post<EventResponse>("/api/events", data);
    return response.data;
  },

  // Leaders
  async getLeaders(params?: { limit?: number; offset?: number }): Promise<LeadersListResponse> {
    const response = await api.get<LeadersListResponse>("/api/leaders", { params });
    return response.data;
  },
  async createLeader(data: LeaderCreate): Promise<LeaderResponse> {
    const response = await api.post<LeaderResponse>("/api/leaders", data);
    return response.data;
  },

  // Downloads
  async getDownloads(params?: { limit?: number; offset?: number }): Promise<DownloadsListResponse> {
    const response = await api.get<DownloadsListResponse>("/api/downloads", { params });
    return response.data;
  },
  async createDownload(formData: FormData): Promise<DownloadResponse> {
    const response = await api.post<DownloadResponse>("/api/downloads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
