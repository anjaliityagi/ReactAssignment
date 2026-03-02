import { Trash2, Star, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SidebarMore() {
  const navigate = useNavigate();

  const handleFavorites = () => {
    navigate(`/favorites`);
  };

  const handleDeleted = () => {
    navigate(`/trash`);
  };

  const handleArchive = () => {
    navigate(`/archive`);
  };

  return (
    <div className="bottom-16 left-0 w-full pt-4 h-[20%]">
      <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wide">
        More
      </div>

      <div className="flex flex-col gap-1">
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-soft)] cursor-pointer hover:bg-[var(--bg-hover)] transition"
          onClick={handleFavorites}
        >
          <Star size={18} />
          Favorites
        </div>

        <div
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-soft)] cursor-pointer hover:bg-[var(--bg-hover)] transition"
          onClick={handleDeleted}
        >
          <Trash2 size={18} />
          Trash
        </div>

        <div
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-soft)] cursor-pointer hover:bg-[var(--bg-hover)] transition"
          onClick={handleArchive}
        >
          <Archive size={18} />
          Archived Notes
        </div>
      </div>
    </div>
  );
}
