import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNotes } from "../../context/NotesContext";
import Skeleton from "./Skeleton";

type filterType = "favorites" | "trash" | "archive";

export default function NotesListItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { notes, loadNotes } = useNotes();

  const { filter, folderName, folderId } = useParams<{
    filter?: filterType;
    folderName?: string;
    folderId?: string;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadNotes(filter, folderId);
      setLoading(false);
    };

    fetchData();
  }, [folderId, filter]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border-gray-800)]">
        <div className="text-[28px] font-semibold text-[var(--text-white)] capitalize">
          {filter ? filter : folderName}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide ">
        {loading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--note-bg)]">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          notes.map((note) => {
            const isActive = location.pathname.includes(note.id);

            return (
              <div
                key={note.id}
                onClick={() => {
                  const base = filter
                    ? `/${filter}`
                    : `/${folderName}/${folderId}`;

                  navigate(`${base}/notes/${note.id}`);
                }}
                className={`
                  mb-4 p-5 cursor-pointer rounded-xl
                  transition-all duration-200 
                  ${
                    isActive
                      ? "bg-[var(--note-active-bg)]"
                      : "bg-[var(--note-bg)] hover:bg-[var(--note-hover-bg)]"
                  }
                `}
              >
                <h3 className="text-[var(--text-white)] text-[15px] font-medium mb-2 truncate">
                  {note.title || "Untitled"}
                </h3>

                <div className="flex items-center gap-1 text-[12px]">
                  <span className="text-[var(--text-gray-500)] whitespace-nowrap">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-[var(--text-gray-400)] truncate">
                    {note.preview}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
