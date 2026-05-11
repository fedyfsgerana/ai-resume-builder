import api from "./api.js";

export const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(data) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};
