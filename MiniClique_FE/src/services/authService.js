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
   * @param {{ email: string, password: string }} data
   * @returns {{ success: boolean, data: object, message: string }}
   */
  login: (data) => {
    return axiosInstance.post(API.USER.LOGIN, data);
  },

  /**
   * Register / Create User
   * @param {{ email: string, password: string, confirmPassword: string, fullName: string, gender: boolean, birthday: string, bio: string }} data
   */
  register: (data) => {
    return axiosInstance.post(API.USER.REGISTER, data);
  },
};

export default authService;
