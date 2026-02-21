export default function NoteDetailHeader() {
  return (
    <div className="noteDetailHeader">
      <input className="noteTitleInput" value="Meeting Notes" readOnly />

      <div className="noteDetailIcons">
        <span className="noteIcon"></span>
        <span className="noteIcon"></span>
        <span className="noteIcon"></span>
      </div>
    </div>
  );
}
