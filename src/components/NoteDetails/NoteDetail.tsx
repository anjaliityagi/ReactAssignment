import NoteDetailHeader from "./NoteDetailHeader";
import NoteDetailMeta from "./NoteDetailMeta";
import NoteDetailEditor from "./NoteDetailEditor";

export default function NoteDetail() {
  
  return (
    <div className="noteDetailContainer">

      <NoteDetailHeader />

      <NoteDetailMeta />

      <NoteDetailEditor />

    </div>
  );
}