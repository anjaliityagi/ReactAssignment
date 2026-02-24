import { Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRecents, type Notes, type RecentNotes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function SidebarRecents() {
  const [recentNotes, setRecentNotes] = useState<RecentNotes[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchRecents().then((data) => {
      setRecentNotes(data);
      console.log(data);
    });
  }, []);
  const handleRecentNote = (note: Notes) => {
    navigate(`/folders/${note.folderId}/notes/${note.id}`);
  };

  return (
    <div className="mb-[22px] max-h-[24%] overflow-auto flex flex-col gap-2">
      <div className="text-xs text-textMuted mb-2">Recents</div>

      {recentNotes.map((recent) => {
        return (
          <div
            className="flex items-center gap-2 px-[10px] py-2 rounded-md text-sm text-textSoft cursor-pointer transition hover:bg-surface"
            onClick={() => handleRecentNote(recent)}
          >
            <Folder size={16} />
            <span className="truncate">{recent.title}</span>
          </div>
        );
      })}
    </div>
  );
}
