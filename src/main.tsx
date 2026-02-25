import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import EmptyNote from "./components/NoteDetails/Pages/EmptyNote";
import NoteView from "./components/NoteDetails/Pages/NoteView";
import "./index.css";
import RestoreNote from "./components/NoteDetails/Pages/RestoreNote";
import SidebarMore from "./components/Sidebar/SidebarMore";
import NotesListItems from "./components/NoteList/NoteListItems";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/:folderName/:folderId",
        children: [
          { index: true, element: <EmptyNote /> },
          { path: "notes/:noteId", element: <NoteView /> },
          { path: "notes/:noteId/restore", element: <RestoreNote /> },
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
