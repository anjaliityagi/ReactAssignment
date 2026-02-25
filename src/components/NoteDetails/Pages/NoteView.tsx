import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Folder,
  MoreVertical,
  Star,
  Archive,
  Trash2,
} from "lucide-react";
import type { Note } from "../../../api";
import { deleteNote, fetchNoteById, updateNote } from "../../../api";
import RestoreNote from "./RestoreNote.tsx";

export default function NoteView() {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadNote() {
      if (!noteId) return;
      try {
        const note = await fetchNoteById(noteId);
        setNote(note);
        setTitle(note?.title ?? "");
        setContent(note?.content ?? "");
      } catch (err) {
        console.error("Failed to load note:", err);
        setNote(null);
      }
    }
    loadNote();
  }, [noteId]);

  const autoSave = useCallback(
    debounce((t: string, c: string) => {
      if (!note || !noteId) return;
      updateNote(noteId, { title: t, content: c });
    }, 500),
    [note, noteId],
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
    navigate(`/${note.folder.name}/${note.folderId}`);
  };

  const toggleFavorite = async () => {
    if (!noteId || !note) return;

    await updateNote(noteId, { isFavorite: !note.isFavorite });

    setNote((prev) =>
      prev ? { ...prev, isFavorite: !prev.isFavorite } : prev,
    );

    setMenuOpen(false);
  };

  const toggleArchive = async () => {
    if (!noteId || !note) return;

    await updateNote(noteId, { isArchived: !note.isArchived });

    setNote((prev) =>
      prev ? { ...prev, isArchived: !prev.isArchived } : prev,
    );

    setMenuOpen(false);
  };

  if (!note) return <div className="p-6 text-textSoft">Note not found</div>;

  if (note.deletedAt) return <RestoreNote />;

  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      <div className="flex justify-between items-start mb-4">
        <input
          className="bg-transparent border-none outline-none text-white text-2xl font-semibold w-full"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
        />

        <div
          className="relative ml-4"
          tabIndex={0}
          onBlur={() => setMenuOpen(false)}
        >
          <MoreVertical
            size={20}
            className="cursor-pointer text-textSoft hover:text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-gray-700 text-sm text-textSoft z-10">
              <div
                className="px-4 py-2 flex items-center gap-2 hover:bg-hoverBg cursor-pointer"
                onClick={toggleFavorite}
              >
                <Star
                  size={16}
                  className={note.isFavorite ? "text-yellow-400" : ""}
                />
                {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </div>

              <div
                className="px-4 py-2 flex items-center gap-2 hover:bg-hoverBg cursor-pointer"
                onClick={toggleArchive}
              >
                <Archive size={16} />
                {note.isArchived ? "Unarchive" : "Archive"}
              </div>

              <div
                className="px-4 py-2 flex items-center gap-2 hover:bg-hoverBg cursor-pointer text-red-400"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6 text-textMuted text-sm">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1">
          <Folder size={16} />
          <span>{note.folder.name}</span>
        </div>
      </div>

      <textarea
        className="bg-transparent border-none outline-none text-white text-sm h-full leading-relaxed w-full resize-none"
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
