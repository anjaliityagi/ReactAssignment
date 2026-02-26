import { useState, useEffect } from "react";
import { Plus, FolderClosed, FolderOpen, Delete } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFolders,
  delFolder,
  editFolder,
  fetchFolders,
  type Folder,
} from "../../api";
//import { useNotes } from "../../context/NotesContext";

export default function SidebarFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  //const { searchQuery, setSearchQuery } = useNotes();
  const navigate = useNavigate();
  const { folderId } = useParams<{
    folderId: string;
  }>();
  const loadFolders = async (delFolderId?: string) => {
    const data = await fetchFolders();
    setFolders(data);

    if (input) {
      const newfolder = data.find((f) => f.name === input);
      navigate(`/${newfolder?.name}/${newfolder?.id}`);
    }

    if (delFolderId && delFolderId === folderId) {
      if (data.length > 0) {
        navigate(`/${data[0].name}/${data[0]?.id}`);
      } else {
        navigate("/");
      }
    }
    if (!folderId && data.length > 0) {
      navigate(`/${data[0].name}/${data[0].id}`);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <div className="mb-[22px] flex-1 overflow-auto scrollbar-hide flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2 px-1">
        <span>Folders</span>
        <button
          className="cursor-pointer hover:text-white transition"
          onClick={() => setShowInput(!showInput)}
        >
          <Plus size={16} />
        </button>
      </div>

      {showInput && (
        <div className="flex items-center gap-2 px-1">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && input.trim()) {
                await createFolders(input);
                setInput("");
                setShowInput(false);
                await loadFolders();
              }
              if (e.key === "Escape") {
                setShowInput(false);
              }
            }}
            className="flex-1 px-3 py-2 rounded-md bg-[#1E1E1E] text-white text-sm outline-none"
            placeholder="New folder name"
          />
        </div>
      )}

      {folders.map((folder) => {
        const isActive = folderId === folder.id;
        const isEditing = edit && editIndex === folder.id;

        return (
          <div
            key={folder.id}
            onClick={() => {
              navigate(`/${folder.name}/${folder.id}`);
              //setSearchQuery("");
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEdit(true);
              setEditIndex(folder.id);
              setInput(folder.name);
            }}
            className={`
              group flex justify-between items-center
              px-3 py-2 rounded-lg text-sm cursor-pointer
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#2A2A2A] text-white"
                  : "text-gray-400 hover:bg-[#1E1E1E]"
              }
            `}
          >
            <div className="flex items-center gap-2 flex-1">
              {isActive ? (
                <FolderOpen size={18} className="text-[#7C5CFF]" />
              ) : (
                <FolderClosed
                  size={18}
                  className="text-gray-400 group-hover:text-gray-200 transition"
                />
              )}

              {isEditing ? (
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editFolder(folder.id, input);
                      setEdit(false);
                    }
                    if (e.key === "Escape") {
                      setEdit(false);
                    }
                  }}
                  onBlur={() => setEdit(false)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1E1E1E] px-2 py-1 rounded-md text-white text-sm outline-none w-full"
                />
              ) : (
                <span className="truncate">{folder.name}</span>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await delFolder(folder.id);
                  setFolders((prev) => prev.filter((f) => f.id !== folder.id));
                  await loadFolders(folder.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition duration-200 text-gray-500 hover:text-red-400"
              >
                <Delete size={18} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
