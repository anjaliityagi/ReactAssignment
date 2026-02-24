import { useState } from "react";

import { createNote, fetchNotes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

export default function SidebarHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  const handleCreateNote = async () => {
    if (folderId) {
      const newNote = await createNote(folderId, "", "", false, false);
      console.log("folderid", folderId);
      console.log("newnoteid", newNote);
      navigate(`/folders/${folderId}/notes/${newNote}`);
    }
  };

  return (
    <>
      <div className="text-xl font-semibold mb-[18px]">
        <div className="flex justify-between items-center">
          <span>
            <img src="/src/assets/Sidebarlogo.svg" alt="logo"></img>
          </span>

          <span
            className="cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          >
            {" "}
            <img src="/src/assets/SearchIcon.svg" alt="search" />
          </span>
        </div>
      </div>

      {showSearch ? (
        <div className="mb-4">
          <input
            className="w-full px-[10px] py-[9px] rounded-md bg-surface text-white text-sm outline-none border-none box-border"
            placeholder:text-textMuted
            autoFocus
          />
        </div>
      ) : (
        <button
          className="w-full py-[10px] mb-[22px] rounded-md bg-surface text-white text-base font-medium cursor-pointer border-none hover:bg-pink-400 transition"
          onClick={handleCreateNote}
        >
          <Plus size={20} />
          New Note
        </button>
      )}
    </>
  );
}
