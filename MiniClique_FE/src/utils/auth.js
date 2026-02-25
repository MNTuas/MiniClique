// ============================================
// Auth Utilities - Token & user management
// ============================================

import {
  TOKEN_KEY,
  USER_KEY,
  USERNAME_KEY,
  PASSWORD_KEY,
  ROLE_KEY,
} from "@/config/constants";

// ===== Token =====
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// ===== User object =====
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const setUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);

// ===== Credentials (username, password, role) =====
export const saveCredentials = ({ userName, password, role }) => {
  if (userName) localStorage.setItem(USERNAME_KEY, userName);
  if (password) localStorage.setItem(PASSWORD_KEY, password);
  if (role) localStorage.setItem(ROLE_KEY, role);
};

export const getCredentials = () => ({
  userName: localStorage.getItem(USERNAME_KEY),
  password: localStorage.getItem(PASSWORD_KEY),
  role: localStorage.getItem(ROLE_KEY),
});

export const removeCredentials = () => {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
  localStorage.removeItem(ROLE_KEY);
};

// ===== Helpers =====
export const isAuthenticated = () => !!getToken() || !!localStorage.getItem(USERNAME_KEY);

export const logout = () => {
  removeToken();
  removeUser();
  removeCredentials();
};
