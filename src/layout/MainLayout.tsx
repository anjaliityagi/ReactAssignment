import Sidebar from "../components/Sidebar/Sidebar";
import NoteListItems from "../components/NoteList/NoteListItems";
import { Outlet } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  return (
    <div className="flex w-screen h-screen p-[3px] overflow-y-auto bg-[var(--bg-main)]">
      <div className="w-1/5 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col">
        <Sidebar />
      </div>

      <div className="w-1/4 bg-[var(--bg-notes)] border-r border-[var(--border-color)]">
        <NoteListItems />
      </div>

      <div className="flex-1 overflow-hidden w-[55%]">
        <Outlet />
      </div>
    </div>
  );
}
