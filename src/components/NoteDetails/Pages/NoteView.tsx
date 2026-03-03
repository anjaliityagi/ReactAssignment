import { useNotes } from "../../../context/NotesContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  FolderArchive,
} from "lucide-react";
import type { Folder, Note } from "../../../api";
import {
  deleteNote,
  fetchNoteById,
  updateNote,
  fetchFolders,
} from "../../../api";
import RestoreNote from "./RestoreNote";
import Skeleton from "../../NoteList/Skeleton";

export default function NoteView() {
  const { loadNotes } = useNotes();
  const navigate = useNavigate();

  const { noteId, filter, folderId } = useParams<{
    noteId: string;
    filter?: "favorites" | "trash" | "archive";
    folderId?: string;
  }>();

  const [note, setNote] = useState<Note | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [folderMenu, setFolderMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [confirmDelete, setConfirmDelete] = useState(false);
  async function loadNote() {
    if (!noteId) return;

    setLoading(true);

    try {
      const data = await fetchNoteById(noteId);
      setNote(data);
      setTitle(data?.title ?? "");
      setContent(data?.content ?? "");
    } catch {
      setNote(null);
    }

    setLoading(false);
  }

  async function loadFolders() {
    const data = await fetchFolders();
    setFolders(data);
  }

  useEffect(() => {
    loadNote();
    loadFolders();
  }, [noteId]);

  const autoSave = useCallback(
    debounce((t: string, c: string) => {
      if (!noteId) return;
      updateNote(noteId, { title: t, content: c });
    }, 500),
    [noteId],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    autoSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    autoSave(title, e.target.value);
  };

  const handleDelete = async () => {
    if (!noteId || !note) return;

    await deleteNote(noteId);
    await loadNotes(filter, folderId);
    navigate(`/${note.folder.name}/${note.folderId}`);
  };

  const toggleFavorite = async () => {
    if (!noteId || !note) return;
    const wasFavorite = note.isFavorite;
    await updateNote(noteId, { isFavorite: !note.isFavorite });
    await loadNotes(filter, folderId);
    setNote((prev) =>
      prev ? { ...prev, isFavorite: !prev.isFavorite } : prev,
    );
    setMenuOpen(false);
    if (filter === "favorites" && wasFavorite) {
      navigate("/favorites");
    }
  };

  const toggleArchive = async () => {
    if (!noteId || !note) return;
    const wasArchived = note.isArchived;
    await updateNote(noteId, { isArchived: !note.isArchived });
    await loadNotes(filter, folderId);
    setNote((prev) =>
      prev ? { ...prev, isArchived: !prev.isArchived } : prev,
    );
    setMenuOpen(false);
    navigate(`/${note.folder.name}/${note.folderId}`);
    if (filter === "archive" && wasArchived) {
      navigate("/archive");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full p-8 space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!note)
    return <div className="p-6 text-[var(--text-soft)]">Note not found</div>;

  if (!!note.deletedAt) return <RestoreNote />;
  if (note.deletedAt) return <RestoreNote />;

  return (
    <div className="flex flex-col h-full p-8 overflow-auto">
      <div className="flex justify-between items-start mb-6">
        <input
          className="bg-transparent border-none outline-none text-[var(--text-white)] text-3xl font-semibold w-full tracking-tight"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />

        <div
          className="relative ml-6"
          tabIndex={0}
          onBlur={() => setMenuOpen(false)}
        >
          <MoreVertical
            size={20}
            className="cursor-pointer text-[var(--text-soft)] hover:text-[var(--text-white)] transition"
            onClick={() => setMenuOpen((prev) => !prev)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-input)] rounded-lg shadow-xl border border-[var(--border-gray-700)] text-sm text-[var(--text-soft)] z-20">
              <div
                onClick={toggleFavorite}
                className="px-4 py-2 flex items-center gap-2 hover:bg-[var(--bg-hover)] cursor-pointer transition"
              >
                <Star
                  size={16}
                  className={note.isFavorite ? "text-[var(--yellow-400)]" : ""}
                />
                {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </div>

              <div
                onClick={toggleArchive}
                className="px-4 py-2 flex items-center gap-2 hover:bg-[var(--bg-hover)] cursor-pointer transition"
              >
                <Archive size={16} />
                {note.isArchived ? "Unarchive" : "Archive"}
              </div>

              <div
                onClick={handleDelete}
                className="px-4 py-2 flex items-center gap-2 hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--danger-red)] transition"
              >
                <Trash2 size={16} />
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8 mb-8 text-[var(--text-muted)] text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>

        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => setFolderMenu((p) => !p)}
        >
          <FolderArchive size={16} />
          <span>{note.folder.name}</span>

          {folderMenu && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-[var(--bg-input)] rounded-lg shadow-xl border border-[var(--border-gray-800)] py-2 text-sm text-[var(--text-gray-300)] z-20">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!noteId) return;

                    await updateNote(note.id, {
                      folderId: folder.id,
                    });

                    navigate(`/${folder.name}/${folder.id}/notes/${noteId}`);
                    setFolderMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-[var(--note-active-bg)] cursor-pointer transition"
                >
                  {folder.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <textarea
        className="bg-transparent border-none outline-none text-[var(--text-white)] text-base leading-relaxed w-full h-full resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

function debounce(func: Function, wait: number) {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}
