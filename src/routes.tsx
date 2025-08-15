import { Navigate, type RouteObject } from "react-router-dom";
import CvPage from "./pages/cv/CvPage";
import PrintCvPage from "./pages/cv/PrintCvPage";
// import AuthPage from "./pages/AuthPage";
// import NotFoundPage from "./pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <CvPage />
    ),
  },
  {
    path: "/print",
    element: (
      <PrintCvPage />
    ),
  },
  {
    path: "*",
    element: (
      <Navigate to="/" />
    ),
  }
  // {
  //   path: "/auth",
  //   element: (
  //     <AuthPage />
  //   ),
  // },
  // {
  //   path: "*",
  //   element: (
  //     <NotFoundPage />
  //   ),
  // },
]; 