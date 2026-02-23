import { useState } from "react";

import { createNote, fetchNotes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function SidebarHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  const handleCreateNote = async () => {
    if (folderId) {
      const newNote = await createNote(folderId, "", "", false, true);
      console.log("folderid", folderId);
      console.log("newnoteid", newNote);
      navigate(`/folders/${folderId}/notes/${newNote}`);
    }
  };

  return (
    <>
      <div className="sidebarLogo">
        <div className="sidebarLogoRow">
          <span>
            <img src="/src/assets/Sidebarlogo.svg" alt="logo"></img>
          </span>

          <span
            className="sidebarSearchIcon "
            onClick={() => setShowSearch(!showSearch)}
          >
            {" "}
            <img src="/src/assets/SearchIcon.svg" alt="search" />
          </span>
        </div>
      </div>

      {showSearch ? (
        <div className="sidebarSearchContainer">
          <input
            className="sidebarSearchInput"
            placeholder="Search notes..."
            autoFocus
          />
        </div>
      ) : (
        <button className="sidebarNewNoteBtn" onClick={handleCreateNote}>
          <img src="/src/assets/AddNoteIcon.svg" alt="addNote" />
          New Note
        </button>
      )}
    </>
  );
}
