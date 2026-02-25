// ============================================
// Auth Service - API calls liên quan đến xác thực
// Endpoints:
//   POST /User/Login
//   POST /User/Create_User
// ============================================

import axiosInstance from "@/config/axiosInstance";
import API from "@/config/api";

const authService = {
  /**
   * Login
   * @param {{ userName: string, password: string }} data
   */
  login: (data) => {
    return axiosInstance.post(API.USER.LOGIN, data);
  },

  /**
   * Register / Create User
   * @param {{ userName: string, email: string, password: string }} data
   */
  register: (data) => {
    return axiosInstance.post(API.USER.REGISTER, data);
  },
};

export default authService;
