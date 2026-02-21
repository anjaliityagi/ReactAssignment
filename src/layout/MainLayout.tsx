import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="app">

      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="notesList">
        Notes List
      </div>

      <div className="noteDetail">
        Note Detail
      </div>

    </div>
  );
}