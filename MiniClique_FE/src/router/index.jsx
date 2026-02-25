// ============================================
// App Router - Cấu hình routes
// ============================================

import { createBrowserRouter } from "react-router-dom";
import { MainLayout, AuthLayout } from "@/layouts";
import HomePage from "@/pages/Home";
import { LoginPage, RegisterPage } from "@/pages/Auth";
import NotFoundPage from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    // Routes có layout chính (sidebar + header)
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Thêm routes mới ở đây
      // {
      //   path: "users",
      //   element: <UsersPage />,
      // },
    ],
  },
  {
    // Routes auth (login, register)
    element: <AuthLayout />,
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
