import { useState, useEffect, useCallback } from "react";
import { Plus, FolderClosed, FolderOpen, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFolders,
  delFolder,
  editFolder,
  fetchFolders,
  type Folder,
} from "../../api";
import { Skeleton } from "../NoteList/Skeleton";
import toast from "react-hot-toast";

export function SidebarFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  const [loading, setLoading] = useState(true);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  // const { folderName } = useParams<{ folderName: string }>();
  const { filter } = useParams<{ filter: string }>();

  const loadFolders = useCallback(
    async (deletedId?: string) => {
      const data = await fetchFolders();
      setFolders(data);

      if (!folderId && !filter && data.length > 0) {
        navigate(`/${data[0].name}/${data[0].id}`);
      }

      if (deletedId && deletedId === folderId) {
        if (data.length > 0) {
          navigate(`/${data[0].name}/${data[0].id}`);
        } else {
          navigate("/");
        }
      }

      setLoading(false);
    },
    [folderId, filter, navigate],
  );

  useEffect(() => {
    async function init() {
      await loadFolders();
    }
    init();
    // loadFolders()
  }, [loadFolders]);

  return (
    <>
      <div className="mb-[22px] flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center text-xs text-[var(--text-gray-500)] mb-2 px-1">
          <span>Folders</span>
          <button
            className="cursor-pointer hover:text-[var(--text-white)] transition"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus size={16} />
          </button>
        </div>

        {showInput && (
          <div className="flex items-center gap-2 px-1 mb-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && input.trim()) {
                  if (
                    folders.some(
                      (folder) =>
                        folder.name.toLowerCase().trim() ===
                        input.toLowerCase().trim(),
                    )
                  ) {
                    toast.success(
                      "this folder already exist, give another name",
                    );
                    return;
                  }
                  await createFolders(input);
                  toast.success("Folder created successfulyy! Wohooo!!");
                  setInput("");
                  setShowInput(false);
                  await loadFolders();
                  const data = await fetchFolders();
                  navigate(`/${data[0].name}/${data[0].id}`);
                }

                if (e.key === "Escape") setShowInput(false);
              }}
              className="flex-1 px-3 py-2 rounded-md bg-[var(--bg-input)] text-[var(--text-white)] text-sm outline-none"
              placeholder="New folder name"
            />
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg bg-[var(--bg-input)] flex items-center gap-3"
                >
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            folders.map((folder) => {
              const isActive = folderId === folder.id;
              const isEditing = edit && editIndex === folder.id;

              return (
                <div
                  key={folder.id}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEdit(true);
                    setEditIndex(folder.id);
                    setInput(folder.name);
                  }}
                  onClick={() => navigate(`/${folder.name}/${folder.id}`)}
                  className={`
              group flex justify-between items-center
              px-3 py-2 rounded-lg text-sm cursor-pointer 
              
              ${
                isActive
                  ? "bg-[var(--folder-active-bg)] text-[var(--text-white)]"
                  : "text-[var(--text-gray-400)] hover:bg-[var(--bg-input)]"
              }
            `}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {isActive ? (
                      <FolderOpen size={18} className="text-[var(--primary)]" />
                    ) : (
                      <FolderClosed
                        size={18}
                        className="text-[var(--text-gray-400)] group-hover:text-[var(--text-gray-200)] transition"
                      />
                    )}

                    {isEditing ? (
                      <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            if (!input.trim()) return;
                            if (
                              folders.some(
                                (f) =>
                                  f.name.toLowerCase().trim() ===
                                    input.toLowerCase().trim() &&
                                  f.id !== folder.id,
                              )
                            ) {
                              toast.error("Folder already exists");
                              return;
                            }

                            await editFolder(folder.id, input);
                            setEdit(false);
                            await loadFolders();
                            toast.success(
                              "FolderName Edited Successfulyy! So Nicee!!",
                            );
                            navigate(`/${input}/${folder.id}`, {
                              replace: true,
                            });
                          }
                          if (e.key === "Escape") {
                            setEdit(false);
                            setInput("");
                          }
                        }}
                        onBlur={() => setEdit(false)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[var(--bg-input)] px-2 py-1 rounded-md text-[var(--text-white)] text-sm outline-none w-full"
                      />
                    ) : (
                      <span className=" max-w-[200px] truncate">
                        {folder.name}
                      </span>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(folder);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition duration-200 text-[var(--text-gray-500)] hover:text-[var(--danger-red)]"
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      {folderToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-[400px] bg-[var(--bg-input)] rounded-xl shadow-2xl border border-[var(--border-gray-700)] p-6">
            <h2 className="text-lg font-semibold text-[var(--text-white)] mb-3">
              Delete Folder
            </h2>

            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this folder?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setFolderToDelete(null)}
                className="px-4 py-2 rounded-md text-sm bg-[var(--bg-hover)] text-[var(--text-white)] hover:opacity-90 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await delFolder(folderToDelete.id);
                  await loadFolders(folderToDelete.id);
                  toast.success("Folder deleted Successfully! Sad...");
                  // await loadFolders(folderToDelete.id);
                  setFolderToDelete(null);
                }}
                className="px-4 py-2 rounded-md text-sm bg-[var(--danger-red)] text-white hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
