// ============================================
// User Service - API calls liên quan đến users
// ============================================

import axiosInstance from "@/config/axiosInstance";

const userService = {
  getAll: (params) => {
    return axiosInstance.get("/users", { params });
  },

  getById: (id) => {
    return axiosInstance.get(`/users/${id}`);
  },

  create: (data) => {
    return axiosInstance.post("/users", data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/users/${id}`, data);
  },

  delete: (id) => {
    return axiosInstance.delete(`/users/${id}`);
  },
};

export default userService;
