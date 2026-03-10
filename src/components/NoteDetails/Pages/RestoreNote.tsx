import { useParams, useLocation, useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { restoreNote, fetchNoteById } from "../../../api";
import { useState } from "react";
import { useNotes } from "../../../context/NotesContext";
import toast from "react-hot-toast";

export function RestoreNote() {
  const { noteId, filter, folderId } = useParams<{
    noteId: string;
    filter?: "favorites" | "trash" | "archive";
    folderId: string;
  }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { loadNotes } = useNotes();
  const noteTitle = state?.title || "this note";

  const handleRestore = async () => {
    if (!noteId) return;
    setLoading(true);
    // console.log(noteId);
    await restoreNote(noteId);
    await loadNotes(() => false, filter, folderId);
    const updatedNote = await fetchNoteById(noteId);

    // console.log(updatedNote.id);
    // console.log(updatedNote.deletedAt);
    // console.log(noteId);
    setLoading(false);

    if (filter === "favorites" || filter === "archive") {
      navigate(`/${filter}/notes/${updatedNote.id}`);
    } else if (filter === "trash") {
      navigate(
        `/${updatedNote.folder.name}/${updatedNote.folder.id}/notes/${updatedNote.id}`,
      );
    } else {
      navigate(
        `/${updatedNote.folder.name}/${updatedNote.folder.id}/notes/${updatedNote.id}`,
      );
    }
    toast.success("Note restored successfulyy!!hurrayy!");
    // await navigate(`/trash`);
    // await loadNotes("trash");
    // navigate(0);
  };

  return (
    <div className="flex flex-1 h-full w-full items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-[var(--border-white-20)] flex items-center justify-center">
            <History size={30} className="text-[var(--text-white-80)]" />
          </div>
        </div>

        <div className="text-2xl font-semibold text-[var(--text-white)] mb-3">
          Restore “{noteTitle}”
        </div>

        <p className="text-sm text-[var(--text-gray-400)] leading-relaxed mb-7">
          Don't want to lose this note? It's not too late! Just click the
          &apos;Restore&apos; button and it will be added back to your list.
          It&apos;s that simple.
        </p>

        <button
          onClick={handleRestore}
          disabled={loading}
          className="px-8 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--text-white)] text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Restoring..." : "Restore"}
        </button>
      </div>
    </div>
  );
}
