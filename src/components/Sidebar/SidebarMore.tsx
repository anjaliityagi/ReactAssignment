import { Trash2, Star, Archive } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function SidebarMore() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="bottom-16 left-0 w-full pt-4 h-[20%]">
      <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wide">
        More
      </div>

      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition
            ${
              isActive("/favorites")
                ? "bg-[var(--note-active-bg)] text-[var(--text-white)]"
                : "text-[var(--text-soft)] hover:bg-[var(--bg-hover)]"
            }
          `}
          onClick={() => navigate("/favorites")}
        >
          <Star size={18} />
          Favorites
        </div>

        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition
            ${
              isActive("/trash")
                ? "bg-[var(--note-active-bg)] text-[var(--text-white)]"
                : "text-[var(--text-soft)] hover:bg-[var(--bg-hover)]"
            }
          `}
          onClick={() => navigate("/trash")}
        >
          <Trash2 size={18} />
          Trash
        </div>

        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition
            ${
              isActive("/archive")
                ? "bg-[var(--note-active-bg)] text-[var(--text-white)]"
                : "text-[var(--text-soft)] hover:bg-[var(--bg-hover)]"
            }
          `}
          onClick={() => navigate("/archive")}
        >
          <Archive size={18} />
          Archived Notes
        </div>
      </div>
    </div>
  );
}
