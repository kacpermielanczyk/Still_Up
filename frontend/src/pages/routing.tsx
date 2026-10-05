import { createBrowserRouter } from "react-router";

import ProtectedRoute from "@/components/routing/ProtectedRoute";
import PublicOnlyRoute from "@/components/routing/PublicOnlyRoute";
import AppLayout from "@/layouts/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import MonitorPage from "@/pages/monitors/MonitorPage";
import MonitorsPage from "@/pages/monitors/MonitorsPage";
import NotFoundPage from "./errors/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/monitors",
            element: <MonitorsPage />,
          },
          {
            path: "/monitors/:monitorId",
            element: <MonitorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
