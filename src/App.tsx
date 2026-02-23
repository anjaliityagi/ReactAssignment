import "./styles.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import NoteListItems from "./components/NoteList/NoteListItems";
import { Outlet } from "react-router-dom";

export default function App() {
  const [selectedFolderId, setSelectedFolderId] = useState("");

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />
      </div>

      <div className="notesList">
        <NoteListItems
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />
      </div>

      <div className="noteDetail">
        <Outlet context={{ selectedFolderId }} />
      </div>
    </div>
  );
}
