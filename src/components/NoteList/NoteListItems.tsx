import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useNotes } from "../../context/NotesContext";
//import type { Notes } from "../../api";

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

  useEffect(() => {
    loadNotes(filter, folderId);
  }, [folderId, filter]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="text-[28px] font-semibold">
          {filter ? filter : folderName}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollable-hide px-4 py-3">
        {notes.map((note) => {
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
                ${isActive ? "bg-[#2A2A2A]" : "bg-[#1C1C1C] hover:bg-[#242424]"}
              `}
            >
              <h3 className="text-white text-[15px] font-medium mb-2 truncate">
                {note.title}
              </h3>

              <div className="flex items-center gap-1 text-[12px]">
                <span className="text-gray-500 whitespace-nowrap">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>

                <span className="text-gray-600">|</span>

                <span className="text-gray-400 truncate">{note.preview}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
