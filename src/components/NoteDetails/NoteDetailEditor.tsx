export default function NoteDetailEditor() {
  return (
    <textarea
      className="noteEditor"
      value={`Discuss project timeline and deliverables.

    Assign tasks to team members.

    Set deadlines for next sprint.`}
      readOnly
    />
  );
}