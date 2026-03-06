import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNotes } from "../../context/NotesContext";
import Skeleton from "./Skeleton";

type filterType = "favorites" | "trash" | "archive";

export default function NotesListItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { notes, loadNotes } = useNotes();
  const [page, setPage] = useState(1);
  const limit = 10;
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filter, folderName, folderId } = useParams<{
    filter?: filterType;
    folderName?: string;
    folderId?: string;
  }>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  // const loadMore = async () => {
  //   const nextPage = page + 1;

  //   await loadNotes(filter, folderId, nextPage, limit, true);

  //   setPage(nextPage);
  // };
  // const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
  //   const bottom =
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     e.currentTarget.clientHeight;

  //   if (bottom) {
  //     loadMore();
  //   }
  // };
  useEffect(() => {
    pageRef.current = page;
    loadingRef.current = loading;
    loadingMoreRef.current = loadingMore;
    hasMoreRef.current = hasMore;
  }, [page, loading, loadingMore, hasMore]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(1);

      const data = await loadNotes(filter, folderId, 1, limit, false);

      setLoading(false);
      setHasMore(data.length === limit);
    };

    fetchData();
  }, [folderId, filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !loadingMoreRef.current &&
          !loadingRef.current &&
          hasMoreRef.current
        ) {
          setLoadingMore(true);
          const nextPage = pageRef.current + 1;
          const data = await loadNotes(filter, folderId, nextPage, limit, true);
          if (data.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setPage(nextPage);
          setLoadingMore(false);
        }
      },
      { root: null, rootMargin: "500px", threshold: 0 },
    );
    const current = observerRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [folderId, filter]);

  const isScrollable =
    containerRef.current &&
    containerRef.current.scrollHeight > containerRef.current.clientHeight + 5;

  return (
    <div className="flex flex-col h-full">
      <div className="text-[28px] font-semibold text-[var(--text-white)] px-4 py-3 border-b border-[var(--border-gray-800)] truncate capitalize">
        {filter ? filter : folderName}
      </div>

      <div
        // onScroll={handleScroll}
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--note-bg)]">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : notes.length == 0 ? (
          <p className="text-[var(--text-gray-500)] text-[15px] font-medium mb-2 flex justify-center align-center">
            Nothing to show here...create a new note by clicking on NewNote
            button
          </p>
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
        {loadingMore && isScrollable && (
          // <div className="p-5 rounded-xl bg-[var(--note-bg)]">
          //   <Skeleton className="h-5 w-3/4 mb-3" />
          //   <Skeleton className="h-4 w-1/2" />
          // </div>
          <div className="flex justify-center transition"> Loading more...</div>
        )}
        {!hasMore && notes.length > 0 && (
          <div className="flex justify-center py-4 text-sm text-[var(--text-gray-500)]">
            No more notes
          </div>
        )}
        <div ref={observerRef} className="h-5 w-20"></div>
      </div>
    </div>
  );
}
