import { useNotes } from "../../context/NotesContext";

import { useState } from "react";
import { createNote, searchNote, type Notes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export default function SidebarHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Notes[]>([]);
  const navigate = useNavigate();
  const { folderName, folderId, filters } = useParams<{
    folderName: string;
    folderId: string;
    filters: "trash" | "archive" | "favorites";
  }>();

  const { searchQuery, setSearchQuery } = useNotes();
  const { loadNotes } = useNotes();

  const handleCreateNote = async () => {
    if (filters) return;

    if (!folderId) return;

    const newNote = await createNote(folderId, "", "", false, false);
    await loadNotes(undefined, folderId);
    navigate(`/${folderName}/${folderId}/notes/${newNote}`);
  };
  const searchingNotes = async (value: string) => {
    setSearchQuery(value);

    if (value && value.trim() !== "") {
      const data = await searchNote(value);
      setResult(data);
      setShowResult(true);
    } else {
      setResult([]);
      setShowResult(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <img src="/src/assets/Sidebarlogo.svg" alt="logo" className="h-6" />

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-gray-400 hover:text-white transition"
        >
          <Search size={18} />
        </button>
      </div>

      {showSearch ? (
        <div
          className="mb-5 relative"
          onBlur={() => setShowResult(false)}
          tabIndex={0}
        >
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => searchingNotes(e.target.value)}
            placeholder="Search notes..."
            className="
              w-full px-3 py-2.5
              rounded-lg
            bg-surface
              text-white text-sm
              placeholder:text-gray-500
              outline-none
              focus:ring-1 focus:ring-bg-primary
              transition
            "
          />

          {showResult && result.length > 0 && (
            <div
              className="
        absolute top-full left-0 mt-2
        w-full
        bg-[#1E1E1E]
        rounded-xl
        shadow-2xl
        border border-gray-800
        max-h-60 overflow-y-auto
        z-50
      "
            >
              {result.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setShowResult(false);
                    setSearchQuery("");
                    navigate(
                      `/${note.folder.name}/${note.folderId}/notes/${note.id}`,
                    );
                  }}
                  className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer"
                >
                  <div className="text-sm text-white truncate">
                    {note.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {note.folder.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleCreateNote}
          className="
  mx-4 flex items-center justify-center gap-2
  py-2.5 mb-6
  rounded-lg
 bg-primary
  text-white text-sm font-medium
 hover:bg-primaryHover
  transition-all duration-200
"
        >
          <Plus size={18} />
          New Note
        </button>
      )}
    </>
  );
}
