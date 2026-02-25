import { useState } from "react";
import { createNote } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export default function SidebarHeader() {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { folderName, folderId } = useParams<{
    folderName: string;
    folderId: string;
  }>();

  const handleCreateNote = async () => {
    if (folderId) {
      const newNote = await createNote(folderId, "", "", false, false);
      navigate(`/${folderName}/${folderId}/notes/${newNote}`);
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
        <div className="mb-5">
          <input
            autoFocus
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
