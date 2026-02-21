import { useState } from "react";

export default function SidebarHeader() {
  const [showSearch, setShowSearch] = useState(false);

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
          <img src="/src/assets/AddNoteIcon.svg" alt="addNote" /> New Note
        </button>
      )}
    </>
  );
}
