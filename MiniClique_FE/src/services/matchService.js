// ============================================
// Match Service
// ============================================

import axiosInstance from "@/config/axiosInstance";
import API from "@/config/api";

const matchService = {
  /** Lấy danh sách matches theo email */
  getByEmail: (email) => {
    return axiosInstance.get(API.MATCHES.GET_BY_EMAIL, {
      params: { email },
    });
  },

  /** Lấy chi tiết match theo id + email */
  getDetail: (id, email) => {
    return axiosInstance.get(API.MATCHES.GET_DETAIL, {
      params: { id, email },
    });
  },
};

export default matchService;
