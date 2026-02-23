import { Trash2, Star, Archive } from "lucide-react";

export default function SidebarMore() {
  return (
    <div className=" fixed bottom-16 left-0 w-full pt-4 ">
      <div className=" text-xs text-textMuted mb-3 uppercase tracking-wide">
        More
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-textSoft cursor-pointer hover:bg-hoverBg transition">
          <Star size={18} />
          Favorites
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-textSoft cursor-pointer hover:bg-hoverBg transition">
          <Trash2 size={18} />
          Trash
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-textSoft cursor-pointer hover:bg-hoverBg transition">
          <Archive size={18} />
          Archived Notes
        </div>
      </div>
    </div>
  );
}
