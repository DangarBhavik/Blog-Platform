
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Interceptor to handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if the refresh request itself fails
    if (originalRequest.url === "/api/auth/refresh-token") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("Access token missing or expired. Attempting token refresh...");
        await api.post("/api/auth/refresh-token");
        console.log("Token refreshed successfully. Retrying request:", originalRequest.url);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed in interceptor:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);