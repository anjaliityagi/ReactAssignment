import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote, fetchNotes } from "../../api";

interface SidebarHeaderProps {
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
}
export default function SidebarHeader({
  selectedFolderId,
  setSelectedFolderId,
}: SidebarHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleCreateNote = async () => {
    if (!selectedFolderId) return;

    const newNote = await createNote(selectedFolderId);

    navigate(`/folders/${selectedFolderId}/notes/${newNote.folderId}`);
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
        <button className="sidebarNewNoteBtn">
          <img
            src="/src/assets/AddNoteIcon.svg"
            alt="addNote"
            onClick={handleCreateNote}
          />{" "}
          New Note
        </button>
      )}
    </>
  );
}
