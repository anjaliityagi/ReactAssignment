import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { Note } from "../../../api";
import { updateNote, fetchNoteById } from "../../../api";

//type OutletContextType = { selectedFolderId: string };

export default function NoteView() {
  //   const { selectedFolderId } = useOutletContext<OutletContextType>();
  const { noteId } = useParams<{ noteId: string }>();
  console.log("noteId", noteId);

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  //   const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadNote() {
      if (!noteId) return;
      console.log("noteId", noteId);
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
      if (!note) return;
      //   setSaving(true);
      if (noteId) {
        updateNote(noteId, { title: t, content: c });
        // setSaving(false);
      }
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
      {/* <div className="noteMeta">
        <div>Created: {note.createdAt}</div>
        <div>Updated: {note.updatedAt}</div>
        {saving && <div style={{ color: "blue" }}>Saving...</div>}
      </div> */}
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
