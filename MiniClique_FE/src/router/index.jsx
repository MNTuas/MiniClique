// ============================================
// App Router - Cấu hình routes
// ============================================

import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout, AuthLayout } from "@/layouts";
import SwipePage from "@/pages/Swipe";
import ProfilePage from "@/pages/Profile";
import { MatchesPage, MatchDetailPage } from "@/pages/Matches";
import { LoginPage, RegisterPage } from "@/pages/Auth";
import NotFoundPage from "@/pages/NotFound";
import { getUser } from "@/utils/auth";

// Guard: phải đăng nhập mới vào được
const ProtectedRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Guard: đã đăng nhập rồi thì vào thẳng trang chủ
const GuestRoute = ({ children }) => {
  const user = getUser();
  if (user) return <Navigate to="/" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SwipePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "matches",
        element: <MatchesPage />,
      },
      {
        path: "matches/:matchId",
        element: <MatchDetailPage />,
      },
    ],
  },
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
