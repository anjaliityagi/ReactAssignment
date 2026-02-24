import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFolders,
  delFolder,
  editFolder,
  fetchFolders,
  type Folder,
} from "../../api";

export default function SidebarFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  //const [del, setDel] = useState(false);
  //const [delIndex, setDelIndex] = useState("");
  const navigate = useNavigate();

  const { folderId } = useParams<{ folderId: string }>();

  // const render = async () => {
  //   const data = await fetchFolders();
  //   setFolders(data);
  //   if (!folderId && data.length > 0) {
  //     navigate(`/folders/${data[0]?.id}`);
  //   }
  // };

  useEffect(() => {
    const loadFolders = async () => {
      const data = await fetchFolders();
      setFolders(data);
      if (!folderId && data.length > 0) {
        navigate(`/folders/${data[0]?.id}`);
      }
      console.log("folders", data);
    };

    loadFolders();
  }, []);

  console.log(input);

  return (
    <div className="mb-[22px] max-h-[30%] overflow-auto flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs text-textMuted mb-2">
        <span>Folders</span>
        <button
          className="cursor-pointer hover:text-white transition"
          onClick={() => setShowInput(!showInput)}
        >
          <img src="/src/assets/AddFolder.svg" alt="addFolder" />
        </button>
      </div>

      {showInput && (
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-[10px] py-2 rounded-md bg-surface text-white text-sm outline-none"
            placeholder="New folder name"
          />
          <button
            className="p-2 rounded-md bg-primary hover:opacity-90 transition"
            onClick={() => {
              createFolders(input);
              setInput("");
              setShowInput(false);
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {folders.map((folder) => {
        const isActive = folderId === folder.id;

        return (
          <div
            key={folder.id}
            onClick={() => navigate(`/folders/${folder.id}`)}
            className={`flex justify-between items-center px-[10px] py-2 rounded-md text-sm transition cursor-pointer ${
              isActive
                ? "bg-primary text-white"
                : "text-textSoft hover:bg-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <img src="/src/assets/DocumentIcon.svg" alt="doc" />

              {edit && editIndex === folder.id ? (
                <div className="flex items-center gap-2">
                  <input
                    defaultValue={folder.name}
                    onChange={(e) => setInput(e.target.value)}
                    className="px-2 py-1 rounded bg-surface text-white text-sm outline-none"
                  />
                  <button
                    className="text-xs bg-primary px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      editFolder(folder.id, input);
                      setEdit(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span>{folder.name}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                className="text-xs hover:text-white transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setEdit(true);
                  setEditIndex(folder.id);
                }}
              >
                Edit
              </button>

              <button
                className="text-xs hover:text-red-400 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  delFolder(folder.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
