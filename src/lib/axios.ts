import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

// ─── AXIOS INSTANCE ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ─── PUBLIC ENDPOINTS (no auth header) ─────────────────────────────────────
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (isPublic) {
    return config; // No headers for public endpoints
  }

  const { accessToken, activeCompanyId } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (activeCompanyId) {
    config.headers["X-Company-Id"] = activeCompanyId;
  }

  return config;
});

// ─── RESPONSE INTERCEPTOR (auto-refresh on 401) ────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) throw new Error("No refresh token");

      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const newAccessToken = response.data.accessToken;
      useAuthStore.getState().setAccessToken(newAccessToken);

      refreshQueue.forEach((cb) => cb(newAccessToken));
      refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
