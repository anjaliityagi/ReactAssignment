import { useState, useEffect } from "react";
import { fetchNotes, type Notes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

export default function NotesListItems() {
  const [notes, setNotes] = useState<Notes[]>([]);
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  useEffect(() => {
    if (folderId) {
      fetchNotes(folderId).then((data) => {
        setNotes(data);
        console.log(data);
      });
    }
  }, [folderId]);

  return (
    <div className="flex flex-col gap-[10px]">
      {notes.map((note) => {
        return (
          <div
            className="p-3 rounded-lg cursor-pointer bg-transparent hover:bg-surface transition "
            onClick={() => navigate(`/folders/${folderId}/notes/${note.id}`)}
          >
            <div className="font-medium mb-1">{note.title}</div>
            <div className="text-[13px] text-gray-400 mb-1">{note.preview}</div>
            <div className="text-xs text-gray-500">{note.createdAt}</div>
          </div>
        );
      })}

      <div className="noteItem">
        <div className="noteItemTitle">Grocery List</div>
        <div className="noteItemPreview">Milk, Bread, Eggs, Coffee...</div>
        <div className="noteItemDate">Yesterday</div>
      </div>
    </div>
  );
}
