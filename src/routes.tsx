import { type RouteObject } from "react-router-dom";
import CvPage from "./pages/cv/CvPage";
import PrintCvPage from "./pages/cv/PrintCvPage";
import LoginPage from "./pages/cv/loginPage";
import SignupPage from "./pages/cv/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

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
    path: "/login",
    element: (
      <LoginPage />
    ),
  },
  {
    path: "/signup",
    element: (
      <SignupPage />
    ),
  },
  {
    path: "*",
    element: (
      <NotFoundPage />
    ),
  }
]; 