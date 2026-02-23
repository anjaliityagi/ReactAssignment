import { useState, useEffect, useCallback } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import type { Notes } from "../../../api";
import { updateNote, fetchNotes } from "../../../api";

type OutletContextType = { selectedFolderId: string };

export default function NoteView() {
  const { selectedFolderId } = useOutletContext<OutletContextType>();
  const { noteId } = useParams<{ noteId: string }>();

  const [note, setNote] = useState<Notes | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadNote() {
      if (!noteId || !selectedFolderId) return;
      try {
        const notes = await fetchNotes(selectedFolderId);
        const foundNote = notes.find((n) => n.id === noteId);
        setNote(foundNote ?? null);
        setTitle(foundNote?.title ?? "");
        setContent(foundNote?.preview ?? "");
      } catch (err) {
        console.error("Failed to load note:", err);
        setNote(null);
      }
    }
    loadNote();
  }, [noteId, selectedFolderId]);

  const autoSave = useCallback(
    debounce((t: string, c: string) => {
      if (!note) return;
      setSaving(true);
      updateNote(note.id, { title: t, content: c }).finally(() =>
        setSaving(false),
      );
    }, 500),
    [note],
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    autoSave(e.target.value, content);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    autoSave(title, e.target.value);
  };

  if (!note) return <div>Note not found</div>;

  return (
    <div className="noteDetailContainer">
      <input
        className="noteTitleInput"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
      />
      <textarea
        className="noteEditor"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
      />
      <div className="noteMeta">
        <div>Created: {note.createdAt}</div>
        <div>Updated: {note.updatedAt}</div>
        {saving && <div style={{ color: "blue" }}>Saving...</div>}
      </div>
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
