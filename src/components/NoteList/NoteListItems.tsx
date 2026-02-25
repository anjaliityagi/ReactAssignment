import { useState, useEffect } from "react";
import {
  fetchArchive,
  fetchDeleted,
  fetchFav,
  fetchNotes,
  type Notes,
} from "../../api";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function NotesListItems() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const navigate = useNavigate();
  const { folderName, folderId } = useParams<{
    folderName: string;
    folderId: string;
  }>();
  const location = useLocation();

  useEffect(() => {
    if (folderId) {
      const loadNotes = async () => {
        const data =
          folderId === "favorites"
            ? await fetchFav(true)
            : folderId === "archive"
              ? await fetchArchive(true)
              : folderId === "trash"
                ? await fetchDeleted(true)
                : await fetchNotes(folderId);

        setNotes(data);
      };
      loadNotes();
    }
  }, [folderId]);

  return (
    <div className="flex flex-col gap-4 px-4 py-3 max-h-[calc(100vh)] overflow-y-auto scrollable-hide">
      <div className="text-[30px]"> {folderName}</div>
      {notes.map((note) => {
        const isActive = location.pathname.includes(note.id);

        return (
          <div
            key={note.id}
            onClick={() =>
              navigate(`/${folderName}/${folderId}/notes/${note.id}`)
            }
            className={`
             p-5 cursor-pointer
            transition-all duration-200
            shadow-sm
            ${isActive ? "bg-[#232323]" : "bg-[#1C1C1C] hover:bg-[#222222]"}
          `}
          >
            <h3 className="text-white text-[16px] font-medium mb-3 truncate">
              {note.title}
            </h3>

            <div className="flex items-center gap-1 text-[13px]">
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
  );
}
