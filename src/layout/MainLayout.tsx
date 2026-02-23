import Sidebar from "../components/Sidebar/Sidebar";
import NoteListItems from "../components/NoteList/NoteListItems";
import { Outlet } from "react-router-dom";
export default function MainLayout() {
  return (
    <div className="flex w-screen h-screen p-[3px] overflow-y-auto bg-[#0f0f10] text-white">
      <div className="w-1/5 bg-sidebar border-r border-surface flex flex-col">
        <Sidebar />
      </div>

      <div className="w-1/4 bg-notesBg border-r border-surface">
        <NoteListItems />
      </div>

      <div className="noteDetail">
        <Outlet />
      </div>
    </div>
  );
}
