import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./AppLayout";
import { HobbyDetailPage } from "../pages/HobbyDetailPage";
import { HobbiesPage } from "../pages/HobbiesPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const appRouter = createBrowserRouter([
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
      }
    ]
  }
]);
