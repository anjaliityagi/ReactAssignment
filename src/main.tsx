import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";

import { EmptyNote } from "./components/NoteDetails/Pages/EmptyNote";
import { NoteView } from "./components/NoteDetails/Pages/NoteView";
import "./index.css";
import { RestoreNote } from "./components/NoteDetails/Pages/RestoreNote";
import { App } from "./App";
import { NotFound } from "./components/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: ":filter",
        children: [
          { index: true, element: <EmptyNote /> },
          { path: "notes/:noteId", element: <NoteView /> },
          { path: "notes/:noteId/restore", element: <RestoreNote /> },
        ],
      },
      {
        path: ":folderName/:folderId",
        children: [
          { index: true, element: <EmptyNote /> },
          { path: "notes/:noteId", element: <NoteView /> },
          { path: "notes/:noteId/restore", element: <RestoreNote /> },
        ],
      },
    ],
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NotesProvider>
    <RouterProvider router={router} />
  </NotesProvider>,
);
