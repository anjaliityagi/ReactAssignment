export default function NotesListItems() {
  return (
    <div className="notesItems">

      <div className="noteItem active">
        <div className="noteItemTitle">
          Meeting Notes
        </div>
        <div className="noteItemPreview">
          Discuss project timeline and deliverables...
        </div>
        <div className="noteItemDate">
          Today
        </div>
      </div>

      <div className="noteItem">
        <div className="noteItemTitle">
          Grocery List
        </div>
        <div className="noteItemPreview">
          Milk, Bread, Eggs, Coffee...
        </div>
        <div className="noteItemDate">
          Yesterday
        </div>
      </div>

      <div className="noteItem">
        <div className="noteItemTitle">
          Ideas
        </div>
        <div className="noteItemPreview">
          Build a notes app using React...
        </div>
        <div className="noteItemDate">
          Feb 18
        </div>
      </div>

    </div>
  );
}