import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecents, type Notes, type RecentNotes } from "../../api";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarRecents() {
  const [recentNotes, setRecentNotes] = useState<RecentNotes[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadRecents = async () => {
      const data = await fetchRecents();
      setRecentNotes(data);
    };
    loadRecents();
  }, []);

  const handleRecentNote = (note: Notes) => {
    navigate(`/${note.folder.name}/${note.folderId}/notes/${note.id}`);
  };

  return (
    <div className="mb-[22px] flex flex-col gap-2">
      <div className="text-xs text-gray-500 mb-2 px-1">Recents</div>

      {recentNotes.map((recent) => {
        const isActive = location.pathname.includes(recent.id);

        return (
          <div
            key={recent.id}
            onClick={() => handleRecentNote(recent)}
            className={`
              group flex justify-between items-center
              px-3 py-2 rounded-lg text-sm cursor-pointer
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#7C5CFF] text-white"
                  : "text-gray-400 hover:bg-[#1E1E1E]"
              }
            `}
          >
            <div className="flex items-center gap-2 flex-1">
              <FileText
                size={18}
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-200 transition"
                }`}
              />

              <span className="truncate">{recent.title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
