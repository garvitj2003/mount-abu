import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAction } from "@/app/actions/auth";

const API_URL = typeof window !== "undefined" ? "/api/proxy" : (process.env.INTERNAL_API_URL || "http://localhost:8000");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required to send cookies to the backend
});

/**
 * Helper to get a cookie value by name (client-side only)
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

/**
 * Request Interceptor to inject the Authorization header.
 */
api.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to track if a refresh is currently in progress
let isRefreshing = false;
// Queue to hold failed requests while refreshing
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Response Interceptor for handling 401 Unauthorized errors.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and it's not a retry already
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResult = await refreshAction();

        if (refreshResult.success) {
          processQueue(null);
          return api(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
