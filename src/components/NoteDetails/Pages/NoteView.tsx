import { useNotes } from "../../../context/NotesContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  FolderArchive,
  ChevronDown,
} from "lucide-react";
import type { Folder, Note } from "../../../api";
import {
  deleteNote,
  fetchNoteById,
  updateNote,
  fetchFolders,
} from "../../../api";
import { Skeleton } from "../../NoteList/Skeleton";
import toast from "react-hot-toast";
import { RestoreNote } from "./RestoreNote";

export function NoteView() {
  const { loadNotes, setNotes, loadRecents } = useNotes();
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancel = false;
    async function loadNote() {
      if (!noteId) return;
      setLoading(true);
      const data = await fetchNoteById(noteId);
      if (!cancel) {
        setNote(data);
        setTitle(data?.title ?? "");
        setContent(data?.content ?? "");
        setLoading(false);
      }
    }
    loadNote();
    return () => {
      cancel = true;
    };
  }, [noteId, folderId]);

  useEffect(() => {
    async function loadFolders() {
      const data = await fetchFolders();
      setFolders(data);
    }
    loadFolders();
  }, []);

  const autoSave = async (title: string, content: string) => {
    if (!noteId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSaving(true);
    try {
      timeoutRef.current = window.setTimeout(async () => {
        await updateNote(noteId, { title, content });

        setSaved(true);
        loadRecents();
        setTimeout(() => setSaved(false), 3000);

        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  title,
                  preview: content.slice(0, 50),
                  updatedAt: new Date().toDateString(),
                }
              : n,
          ),
        );
      }, 1000);
    } catch (error) {
      toast.error("Note not saved..retrying");
      try {
        await updateNote(noteId, { title, content });
      } catch {
        toast.error("Network error, please try again");
        console.log(error);
      }
    } finally {
      setSaving(false);
    }
  };

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

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteNote(noteId);
      toast.success("Note deleted!!");
      setConfirmDelete(false);
      await loadNotes(() => false, filter, folderId);

      navigate(
        filter
          ? `/${filter}/notes/${noteId}/restore`
          : `/${note.folder.name}/${note.folder.id}/notes/${note.id}/restore`,
        { state: { title: note.title } },
      );
    } catch {
      toast.error("Note not deleted!!, retry with good network connection!");
    }
  };

  const toggleFavorite = async () => {
    if (!noteId || !note) return;

    const wasFavorite = note.isFavorite;
    setMenuOpen(false);

    try {
      await updateNote(noteId, { isFavorite: !note.isFavorite });
      await loadNotes(() => false, filter, folderId);

      setNote((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : prev,
      );

      if (filter === "favorites" && wasFavorite) {
        navigate("/favorites");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const toggleArchive = async () => {
    if (!noteId || !note) return;

    const wasArchived = note.isArchived;
    setMenuOpen(false);

    try {
      await updateNote(noteId, { isArchived: !note.isArchived });
      await loadNotes(() => false, filter, folderId);

      setNote((prev) =>
        prev ? { ...prev, isArchived: !prev.isArchived } : prev,
      );

      if (filter) {
        navigate(`/${filter}`);
      } else {
        navigate(`/${note.folder.name}/${note.folderId}`);
      }

      if (filter === "archive" && wasArchived) {
        navigate("/archive");
      }
    } catch {
      toast.error("Something went wrong!");
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
      </div>
    );
  }

  if (!note)
    return (
      <div className="flex justify-center items-center h-full text-[var(--text-gray-500)]">
        Note not found
      </div>
    );

  if (note.deletedAt) return <RestoreNote />;

  return (
    <div className="flex flex-col h-full p-8 overflow-auto relative">
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
          className="relative flex items-center gap-2 cursor-pointer max-w-[220px]"
          tabIndex={0}
          onBlur={() => setFolderMenu(false)}
        >
          <div
            className="flex items-center gap-2 w-full"
            onClick={() => setFolderMenu((p) => !p)}
          >
            <FolderArchive size={16} className="flex-shrink-0" />

            <span className="truncate" title={note.folder.name}>
              {note.folder.name}
            </span>
            <ChevronDown size={16} />
          </div>

          {folderMenu && (
            <div className="absolute left-0 top-full mt-2 w-52 max-h-80 overflow-y-auto bg-[var(--bg-input)] scrollbar-hide rounded-lg shadow-xl border border-[var(--border-gray-800)] py-2 text-sm text-[var(--text-gray-300)] z-20">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onMouseDown={async (e) => {
                    e.stopPropagation();
                    if (!noteId) return;

                    await updateNote(note.id, {
                      folderId: folder.id,
                    });

                    navigate(`/${folder.name}/${folder.id}/notes/${note.id}`);
                    setFolderMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-[var(--note-active-bg)] cursor-pointer flex items-center"
                >
                  <span className="truncate w-full" title={folder.name}>
                    {folder.name}
                  </span>
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

      {saving ? (
        <div className="absolute bottom-8 right-10 text-[var(--text-gray-400)] text-lg">
          Saving...
        </div>
      ) : saved ? (
        <div className="absolute bottom-8 right-10 text-[var(--text-gray-400)] text-lg">
          Saved.
        </div>
      ) : (
        ""
      )}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-[var(--bg-input)] p-6 rounded-xl shadow-xl w-[320px]">
            <div className="text-[var(--text-white)] text-lg font-medium mb-3">
              Delete this note?
            </div>

            <p className="text-[var(--text-gray-400)] text-sm mb-6">
              This note will be moved to trash. You can restore it later.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-white)] bg-[var(--bg-hover)] hover:bg-[var(--note-hover-bg) ]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:opacity-90 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
