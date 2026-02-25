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
    GET_ALL: `/User/Get_User`,
    GET_BY_ID: `/User/Get_User_By_Id`, // ?id=xxx
  },

  // User Likes
  LIKES: {
    CREATE: `/UserLikes/Create_User_Likes`,
  },

  // User Matches
  MATCHES: {
    GET_BY_EMAIL: `/UserMatches/Get_User_Matches_By_Email`, // ?email=xxx
    GET_DETAIL: `/UserMatches/Get_User_Matches_Detail_By_EmailId`, // ?id=xxx&email=xxx
  },

  // Availabilities
  AVAILABILITIES: {
    GET_USER: `/Availabilities/Get_User_Availabilities`,
    CREATE: `/Availabilities/Create_User_Availabilities`,
    UPDATE: `/Availabilities/Update_User_Availabilities/sa`,
  },
};

export default API;
