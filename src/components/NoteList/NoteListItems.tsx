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
    <div className="notesItems">
      {notes.map((note) => {
        return (
          <div
            className="noteItem active"
            onClick={() => navigate(`/folders/${folderId}/notes/${note.id}`)}
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
