import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecents, type Notes, type RecentNotes } from "../../api";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "../NoteList/Skeleton";

export default function SidebarRecents() {
  const [recentNotes, setRecentNotes] = useState<RecentNotes[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadRecents = async () => {
      setLoading(true);
      const data = await fetchRecents();
      setRecentNotes(data);
      setLoading(false);
    };
    loadRecents();
  }, []);

  const handleRecentNote = (note: Notes) => {
    navigate(`/${note.folder.name}/${note.folderId}/notes/${note.id}`);
  };

  return (
    <div className="mb-[22px] flex flex-col gap-2 min-h-[15%]">
      <div className="text-xs text-[var(--text-gray-500)] mb-2 px-1">
        Recents
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
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
        recentNotes.map((recent) => {
          const isActive = location.pathname.includes(recent.id);

          return (
            <div
              key={recent.id}
              onClick={() => handleRecentNote(recent)}
              className={`
                group flex justify-between items-center
                px-3 py-2 rounded-lg text-sm cursor-pointer
                transition-all duration-200 truncate
                ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--text-white)]"
                    : "text-[var(--text-gray-400)] hover:bg-[var(--bg-input)]"
                }
              `}
            >
              <div className="flex items-center gap-2 flex-1">
                <FileText
                  size={18}
                  className={`${
                    isActive
                      ? "text-[var(--text-white)]"
                      : "text-[var(--text-gray-400)] group-hover:text-[var(--text-gray-200)] transition"
                  }`}
                />
                <span className="truncate">{recent.title || "Untitled"}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
