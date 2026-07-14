import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/auth.store";

//  AXIOS INSTANCE
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

//  PUBLIC ENDPOINTS (no auth header)
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

//  REQUEST INTERCEPTOR
authAxios.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));
    if (isPublic) return config;

    const { accessToken, activeCompanyId } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const companyId =
      activeCompanyId ?? localStorage.getItem("activeCompanyId");

    if (companyId) {
      config.headers["X-Company-Id"] = companyId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//RESPONSE INTERCEPTOR (auto-refresh on 401)
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
};

authAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Pass through non-401 errors or already-retried / auth requests
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error.response?.data ?? error);
    }

    originalRequest._retry = true;

    // Queue subsequent requests while refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(authAxios(originalRequest));
        });
        // Reject queued requests if refresh ultimately fails
        setTimeout(() => reject(new Error("Refresh timeout")), 10000);
      });
    }

    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(new Error("No refresh token"));
      }

      const response = await axios.post(
        `${authAxios.defaults.baseURL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const newAccessToken: string = response.data.accessToken;
      useAuthStore.getState().setAccessToken(newAccessToken);

      processQueue(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return authAxios(originalRequest);
    } catch (refreshError) {
      refreshQueue = [];
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default authAxios;
