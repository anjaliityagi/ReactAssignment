import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { ThemeProvider } from "./context/ThemeContext";
import { NotesProvider } from "./context/NotesContext";

//import App from "./App";
import { EmptyNote } from "./components/NoteDetails/Pages/EmptyNote";
import { NoteView } from "./components/NoteDetails/Pages/NoteView";
import "./index.css";
import { RestoreNote } from "./components/NoteDetails/Pages/RestoreNote";
// import SidebarMore from "./components/Sidebar/SidebarMore";
// import NotesListItems from "./components/NoteList/NoteListItems";
// import { MainLayout } from "./layout/MainLayout";
import { App } from "./App";
// import { MainLayout } from "./layout/MainLayout";
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
    <NotesProvider>
      <RouterProvider router={router} />
    </NotesProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>,
);
