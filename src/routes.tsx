import { type RouteObject } from "react-router-dom";
import CvPage from "./pages/cv/CvPage";
import PrintCvPage from "./pages/cv/PrintCvPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Logout from "./pages/auth/Logout";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <CvPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/print",
    element: <PrintCvPage />,
  }
]; 