// ============================================
// Availability Service
// ============================================

import axiosInstance from "@/config/axiosInstance";
import API from "@/config/api";

const availabilityService = {
  /** Tạo availabilities cho match */
  create: (data) => {
    return axiosInstance.post(API.AVAILABILITIES.CREATE, data);
  },

  /** Cập nhật availabilities cho match */
  update: (data) => {
    return axiosInstance.put(API.AVAILABILITIES.UPDATE, data);
  },

  /** Lấy availabilities của user */
  getUser: (params) => {
    return axiosInstance.get(API.AVAILABILITIES.GET_USER, { params });
  },
};

export default availabilityService;
