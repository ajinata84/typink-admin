import React from "react";
import ReactDOM from "react-dom/client";
import "../app/globals.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home.tsx";
import Auth from "./routes/Auth.tsx";
import Forum from "./routes/Forum.tsx";
import ForumComments from "./routes/ForumComments.tsx";
import LiteratureComments from "./routes/LiteratureComments.tsx";
import ChapterComments from "./routes/ChapterComments.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import LiteraturePage from "./routes/Literature.tsx";
import ChapterPage from "./routes/Chapter.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"; // Import the ProtectedRoute component

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/forum",
    element: (
      <ProtectedRoute>
        <Forum />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forum-comments",
    element: (
      <ProtectedRoute>
        <ForumComments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/literature",
    element: (
      <ProtectedRoute>
        <LiteraturePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/literature-comments",
    element: (
      <ProtectedRoute>
        <LiteratureComments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chapter",
    element: (
      <ProtectedRoute>
        <ChapterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chapter-comments",
    element: (
      <ProtectedRoute>
        <ChapterComments />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
