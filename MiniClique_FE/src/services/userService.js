// ============================================
// User Service
// ============================================

import axiosInstance from "@/config/axiosInstance";
import API from "@/config/api";

const userService = {
  /** Lấy tất cả users */
  getAll: () => {
    return axiosInstance.get(API.USER.GET_ALL);
  },

  /** Lấy user theo id */
  getById: (id) => {
    return axiosInstance.get(API.USER.GET_BY_ID, { params: { id } });
  },

  getRandomUsers: (currentUser) => {
    return axiosInstance.get(API.USER.GET_RANDOM_USERS, { params: { currentUser } });
  }
};

export default userService;
