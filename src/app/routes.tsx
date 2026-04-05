import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { MockTestPage } from "./pages/MockTestPage";
import { ResultPage } from "./pages/ResultPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { LandingPage } from "./pages/LandingPage";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: LandingPage },
    ],
  },
  {
    path: "/home",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "test/:testId/review/:reviewResultId", Component: MockTestPage },
      { path: "test/:testId", Component: MockTestPage },
      { path: "result/:resultId", Component: ResultPage },
    ],
  },
]);