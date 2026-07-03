
import { api } from "@/lib/axios-instance";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },
  login: async (data: LoginPayload) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/me");
    return response.data.data;
  },

  refreshToken: async () => {
    const response = await api.post("/api/auth/refresh-token");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },
};