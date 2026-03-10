import { Sidebar } from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { NotesListItems } from "../components/NoteList/NoteListItems";
export function MainLayout() {
  const [theme, setTheme] = useState(() => {
    const th = localStorage.getItem("theme");
    return th === "dark" ? "dark" : "light";
  });

  const toggleTheme = () => {
    console.log("change");

    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };
  return (
    <div className={`${theme} min-h-screen `}>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-input)",
            color: "var(--text-white)",
            border: "1px solid var(--border-gray-800)",
          },
        }}
      />
      <div className="flex w-screen h-screen p-[3px] overflow-y-auto bg-[var(--bg-main)]">
        <div className="w-1/5 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col">
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="w-1/4 bg-[var(--bg-notes)] border-r border-[var(--border-color)]">
          <NotesListItems />
        </div>

        <div className="flex-1 overflow-hidden w-[55%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
