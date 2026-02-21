import "./styles.css";

import Sidebar from "./components/Sidebar/Sidebar";
import NotesList from "./components/NoteList/NoteList";
//import NoteDetail from "./components/NoteDetails/NoteDetail";

export default function App() {
  return (
    <div className="app">

      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="notesList">
        <NotesList />
      </div>

      {/* <div className="noteDetail">
        <NoteDetail />
      </div> */}

    </div>
  );
}