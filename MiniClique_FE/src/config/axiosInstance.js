// ============================================
// Axios Instance - Cấu hình chung cho HTTP requests
// ============================================

import axios from "axios";
import { getToken, removeToken } from "@/utils/auth";
import { message } from "antd";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://minicliquedemo-atg4bedphggdgggp.southeastasia-01.azurewebsites.net/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== Request Interceptor ==========
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== Response Interceptor ==========
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Token hết hạn hoặc không hợp lệ
          removeToken();
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
          break;
        case 403:
          message.error("Bạn không có quyền truy cập.");
          break;
        case 404:
          message.error("Không tìm thấy dữ liệu.");
          break;
        case 500:
          message.error("Lỗi hệ thống. Vui lòng thử lại sau.");
          break;
        default:
          message.error(response.data?.message || "Đã có lỗi xảy ra.");
      }
    } else {
      message.error("Không thể kết nối đến server.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
