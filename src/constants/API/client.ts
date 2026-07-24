"use client";

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// 1. Extend the Axios config to include our custom _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 2. Strongly type the queue array
interface FailedRequestQueue {
  // Removed the '?' after value so it strictly expects string | null
  resolve: (value: string | null) => void;
  reject: (reason?: any) => void;
}

const DOMAIN_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

const apiClient = axios.create({
  baseURL: DOMAIN_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return Promise.reject(new Error("No internet connection"));
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        // Safe assignment for Axios v1+
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- Response Interceptor & Token Refresh Logic ---
let isRefreshing = false;
let failedQueue: FailedRequestQueue[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

        if (!refreshToken) {
          throw new Error("Missing Refresh Token in LocalStorage");
        }

        const baseUrl = DOMAIN_URL.endsWith('/') ? DOMAIN_URL.slice(0, -1) : DOMAIN_URL;

        const { data } = await axios.post(`${baseUrl}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = data.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        }

        return apiClient(originalRequest);

      } catch (refreshError: any) {
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");

          // Successfully resets the session if the refresh token is dead
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;