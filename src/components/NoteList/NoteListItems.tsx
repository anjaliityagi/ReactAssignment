import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNotes } from "../../context/NotesContext";
import Skeleton from "./Skeleton";

type filterType = "favorites" | "trash" | "archive";

export default function NotesListItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notes, loadNotes } = useNotes();

  const { filter, folderName, folderId } = useParams<{
    filter?: filterType;
    folderName?: string;
    folderId?: string;
  }>();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(1);

      const data = await loadNotes(filter, folderId, 1, limit, false);

      setLoading(false);
      setHasMore(data.length === limit);
    };

    fetchData();
  }, [folderId, filter, loadNotes]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loadingMore && hasMore) {
          setLoadingMore(true);

          const nextPage = page + 1;
          const data = await loadNotes(filter, folderId, nextPage, limit, true);

          setPage(nextPage);
          setHasMore(data.length === limit);
          setLoadingMore(false);
        }
      },
      { rootMargin: "500px" },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => observer.disconnect();
  }, [page, loadingMore, hasMore, loading, folderId, filter, loadNotes]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-[28px] font-semibold text-[var(--text-white)] px-4 py-3 border-b border-[var(--border-gray-800)] truncate capitalize">
        {filter ? filter : folderName}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
        {loading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--note-bg)]">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p className="text-[var(--text-gray-500)] text-[15px] font-medium mb-2 flex justify-center align-center">
            Nothing to show here...create a new note by clicking on NewNote
            button
          </p>
        ) : (
          notes.map((note) => {
            const isActive = location.pathname.includes(note.id);

            const base = filter ? `/${filter}` : `/${folderName}/${folderId}`;

            return (
              <div
                key={note.id}
                onClick={() =>
                  navigate(`${base}/notes/${note.id}`, {
                    state: { title: note.title },
                  })
                }
                className={`
                  mb-4 p-5 cursor-pointer rounded-xl
                 
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

        {loadingMore && (
          <div className="flex justify-center text-[var(--text-gray-500)] transition">
            Loading more...
          </div>
        )}

        {!hasMore && notes.length > 0 && !loading && (
          <div className="flex justify-center py-4 text-sm text-[var(--text-gray-500)]">
            No more notes
          </div>
        )}

        <div ref={observerRef} className="h-5 w-20" />
      </div>
    </div>
  );
}
