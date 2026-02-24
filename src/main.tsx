import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import EmptyNote from "./components/NoteDetails/Pages/EmptyNote";
import NoteView from "./components/NoteDetails/Pages/NoteView";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "folders/:folderId",
        children: [
          { index: true, element: <EmptyNote /> },
          { path: "notes/:noteId", element: <NoteView /> },
          //  { path: "notes" },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
