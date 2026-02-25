// ============================================
// API Endpoints Configuration
// Tập trung quản lý tất cả URL API ở đây
// ============================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://minicliquedemo-atg4bedphggdgggp.southeastasia-01.azurewebsites.net/api";

const API = {
  BASE_URL: API_BASE_URL,

  // Auth / User
  USER: {
    LOGIN: `/User/Login`,
    REGISTER: `/User/Create_User`,
  },

  // Availabilities
  AVAILABILITIES: {
    GET_USER: `/Availabilities/Get_User_Availabilities`,
  },
};

export default API;
