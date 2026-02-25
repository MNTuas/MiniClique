// ============================================
// useAuth Hook - Quản lý auth state
// ============================================

import { useState, useEffect, useCallback } from "react";
import { getToken, getUser, setToken, setUser, logout as doLogout } from "@/utils/auth";
import { authService } from "@/services";

const useAuth = () => {
  const [user, setUserState] = useState(getUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { token, user: userData } = response.data || response;
      setToken(token);
      setUser(userData);
      setUserState(userData);
      setIsLoggedIn(true);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    doLogout();
    setUserState(null);
    setIsLoggedIn(false);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      const userData = response.data || response;
      setUser(userData);
      setUserState(userData);
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    if (isLoggedIn && !user) {
      fetchUser();
    }
  }, [isLoggedIn, user, fetchUser]);

  return { user, isLoggedIn, loading, login, logout, fetchUser };
};

export default useAuth;
