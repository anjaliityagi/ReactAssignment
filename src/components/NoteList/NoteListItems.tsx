import { useState, useEffect } from "react";
import { fetchNotes, type Notes } from "../../api";
import { useNavigate } from "react-router-dom";

interface NoteListItemsProps {
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
}
export default function NotesListItems({
  selectedFolderId,
}: NoteListItemsProps) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes(selectedFolderId).then((data) => {
      setNotes(data);
      console.log(data);
    });
  }, [selectedFolderId]);

  return (
    <div className="notesItems">
      {notes.map((note) => {
        return (
          <div
            className="noteItem active"
            onClick={() =>
              navigate(`/folders/${selectedFolderId}/notes/${note.id}`)
            }
          >
            <div className="noteItemTitle">{note.title}</div>
            <div className="noteItemPreview">{note.preview}</div>
            <div className="noteItemDate">{note.createdAt}</div>
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
