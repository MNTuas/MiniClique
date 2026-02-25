// ============================================
// Like Service
// ============================================

import axiosInstance from "@/config/axiosInstance";
import API from "@/config/api";

const likeService = {
  /** Like một user */
  create: (data) => {
    return axiosInstance.post(API.LIKES.CREATE, data);
  },
};

export default likeService;
