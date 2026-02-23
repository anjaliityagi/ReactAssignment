import { Trash2 } from "lucide-react";
export default function SidebarMore() {
  return (
    <div className="sidebarSection">
      <div className="sidebarSectionTitle">More</div>

      <div className="sidebarItem">Favorites</div>

      <div className="sidebarItem">
        <Trash2 size={18} />
        Trash
      </div>

      <div className="sidebarItem">Archived Notes</div>
    </div>
  );
}
