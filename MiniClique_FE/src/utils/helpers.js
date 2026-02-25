// ============================================
// Helper Utilities
// ============================================

import dayjs from "dayjs";

/**
 * Format ngày tháng
 */
export const formatDate = (date, format = "DD/MM/YYYY") => {
  return date ? dayjs(date).format(format) : "";
};

/**
 * Format số tiền VNĐ
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Rút gọn text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

/**
 * Tạo query string từ object params
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};
