import api from "@/lib/axios";
import { type components } from "@/types/api";

type NoticeCreate = components["schemas"]["Body_create_notice_api_notices_post"];
type NoticeResponse = components["schemas"]["NoticeResponse"];
type NoticesListResponse = components["schemas"]["NoticesListResponse"];

type TenderCreate = components["schemas"]["Body_create_tender_api_tenders_post"];
type TenderResponse = components["schemas"]["TenderResponse"];
type TendersListResponse = components["schemas"]["TendersListResponse"];

type EventCreate = components["schemas"]["Body_create_event_api_events_post"];
type EventResponse = components["schemas"]["EventResponse"];
type EventsListResponse = components["schemas"]["EventsListResponse"];

type LeaderCreate = components["schemas"]["Body_create_leader_api_leaders_post"];
type LeaderResponse = components["schemas"]["LeaderResponse"];
type LeadersListResponse = components["schemas"]["LeadersListResponse"];

type DownloadResponse = components["schemas"]["DownloadResponse"];
type DownloadsListResponse = components["schemas"]["DownloadsListResponse"];

type ContactDiaryCreate = components["schemas"]["ContactDiaryCreate"];
type ContactDiaryUpdate = components["schemas"]["ContactDiaryUpdate"];
type ContactDiaryResponse = components["schemas"]["ContactDiaryResponse"];
type PaginatedContactDiaryResponse = components["schemas"]["PaginatedContactDiaryResponse"];

type NoticeUpdate = components["schemas"]["NoticeUpdate"];
type TenderUpdate = components["schemas"]["TenderUpdate"];
type EventUpdate = components["schemas"]["EventUpdate"];
type LeaderUpdate = components["schemas"]["LeaderUpdate"];
type DownloadUpdate = components["schemas"]["DownloadUpdate"];

export const WebsiteContentService = {
  // Notices
  async getNotices(params?: { limit?: number; offset?: number }): Promise<NoticesListResponse> {
    const response = await api.get<NoticesListResponse>("/api/notices", { params });
    return response.data;
  },
  async createNotice(data: FormData): Promise<NoticeResponse> {
    const response = await api.post<NoticeResponse>("/api/notices", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateNotice(id: number, data: NoticeUpdate): Promise<NoticeResponse> {
    const response = await api.put<NoticeResponse>(`/api/notices/${id}`, data);
    return response.data;
  },
  async deleteNotice(id: number): Promise<any> {
    const response = await api.delete(`/api/notices/${id}`);
    return response.data;
  },

  // Tenders
  async getTenders(params?: { limit?: number; offset?: number }): Promise<TendersListResponse> {
    const response = await api.get<TendersListResponse>("/api/tenders", { params });
    return response.data;
  },
  async createTender(data: FormData): Promise<TenderResponse> {
    const response = await api.post<TenderResponse>("/api/tenders", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateTender(id: number, data: TenderUpdate): Promise<TenderResponse> {
    const response = await api.put<TenderResponse>(`/api/tenders/${id}`, data);
    return response.data;
  },
  async deleteTender(id: number): Promise<any> {
    const response = await api.delete(`/api/tenders/${id}`);
    return response.data;
  },

  // Events
  async getEvents(params?: { limit?: number; offset?: number }): Promise<EventsListResponse> {
    const response = await api.get<EventsListResponse>("/api/events", { params });
    return response.data;
  },
  async createEvent(data: FormData): Promise<EventResponse> {
    const response = await api.post<EventResponse>("/api/events", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateEvent(id: number, data: EventUpdate): Promise<EventResponse> {
    const response = await api.put<EventResponse>(`/api/events/${id}`, data);
    return response.data;
  },
  async deleteEvent(id: number): Promise<any> {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  // Leaders
  async getLeaders(params?: { limit?: number; offset?: number }): Promise<LeadersListResponse> {
    const response = await api.get<LeadersListResponse>("/api/leaders", { params });
    return response.data;
  },
  async createLeader(data: FormData): Promise<LeaderResponse> {
    const response = await api.post<LeaderResponse>("/api/leaders", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async updateLeader(id: number, data: LeaderUpdate): Promise<LeaderResponse> {
    const response = await api.put<LeaderResponse>(`/api/leaders/${id}`, data);
    return response.data;
  },
  async deleteLeader(id: number): Promise<any> {
    const response = await api.delete(`/api/leaders/${id}`);
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
  async updateDownload(id: number, data: DownloadUpdate): Promise<DownloadResponse> {
    const response = await api.put<DownloadResponse>(`/api/downloads/${id}`, data);
    return response.data;
  },
  async deleteDownload(id: number): Promise<any> {
    const response = await api.delete(`/api/downloads/${id}`);
    return response.data;
  },

  // Contact Diary
  async getContacts(params?: { page?: number; size?: number }): Promise<PaginatedContactDiaryResponse> {
    const response = await api.get<PaginatedContactDiaryResponse>("/api/contact-diary", { params });
    return response.data;
  },
  async createContact(data: ContactDiaryCreate): Promise<ContactDiaryResponse> {
    const response = await api.post<ContactDiaryResponse>("/api/contact-diary", data);
    return response.data;
  },
  async updateContact(id: number, data: ContactDiaryUpdate): Promise<ContactDiaryResponse> {
    const response = await api.put<ContactDiaryResponse>(`/api/contact-diary/${id}`, data);
    return response.data;
  },
  async deleteContact(id: number): Promise<any> {
    const response = await api.delete(`/api/contact-diary/${id}`);
    return response.data;
  },
};

