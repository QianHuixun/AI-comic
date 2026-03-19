import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectRoute"
import { lazy } from "react";
const Login = lazy(() => import("../pages/login"));
const Layout = lazy(() => import("../components/layout"));
const My = lazy(() => import("../pages/my"));
const Ranking = lazy(() => import("../pages/ranking"));
const Settings = lazy(() => import("../pages/settings"));
const Category = lazy(() => import("../pages/category"));
const NotFound = lazy(() => import("../pages/notfound"));
const EditProfilePage = lazy(() => import("../pages/edit-profile"));
const Home = lazy(() => import("../pages/home"));
const Forum = lazy(() => import("../pages/forum"))
const AiCreation = lazy(() => import("../pages/ai-creation"))

// 创建并导出路由
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "my",
        element: <ProtectedRoute><My /></ProtectedRoute>,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "ai-creation",
        element: <AiCreation />,
      },
      {
        path: "forum",
        element: <ProtectedRoute><Forum /></ProtectedRoute>,
      },
      {
        path: "edit-profile",
        element: <ProtectedRoute><EditProfilePage /></ProtectedRoute>,
      },

      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
