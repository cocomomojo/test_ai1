import { createBrowserRouter } from "react-router-dom";

import { normalizeRouterBasename } from "./basePath";
import { AppLayout } from "./AppLayout";
import { ActivityPage } from "../pages/ActivityPage";
import { HobbyDetailPage } from "../pages/HobbyDetailPage";
import { HobbiesPage } from "../pages/HobbiesPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TestReportPage } from "../pages/TestReportPage";

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "hobbies",
          element: <HobbiesPage />
        },
        {
          path: "hobbies/:slug",
          element: <HobbyDetailPage />
        },
        {
          path: "activity",
          element: <ActivityPage />
        },
        {
          path: "report",
          element: <TestReportPage />
        }
      ]
    }
  ],
  {
    basename: normalizeRouterBasename(import.meta.env.BASE_URL)
  }
);
