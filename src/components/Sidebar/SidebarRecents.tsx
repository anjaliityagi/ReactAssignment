import { useState, useEffect } from "react";
import { fetchRecents, type RecentNotes } from "../../api";

export default function SidebarRecents() {
  const [recentNotes, setRecentNotes] = useState<RecentNotes[]>([]);

  useEffect(() => {
    fetchRecents().then((data) => {
      setRecentNotes(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="sidebarSection">
      <div className="sidebarSectionTitle">Recents</div>

      {recentNotes.map((recent) => {
        return (
          <div className="sidebarItem active">
            <img src="src/assets/DocumentIcon.svg" alt="doc" />
            {recent.title}
          </div>
        );
      })}
    </div>
  );
}
