import type { RouteObject } from "react-router-dom";
import CvPage from "./pages/cv/CvPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <CvPage />
    ),
  },
  {
    path: "/auth",
    element: (
      <AuthPage />
    ),
  },
  {
    path: "*",
    element: (
      <NotFoundPage />
    ),
  },
]; 