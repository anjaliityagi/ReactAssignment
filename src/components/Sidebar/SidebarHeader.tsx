import { useNotes } from "../../context/NotesContext";
import { useState, useRef } from "react";
import { createNote, searchNote, type Notes } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Sun, Moon } from "lucide-react";
// import { useTheme } from "../../context/ThemeContext";
import Logo from "./Logo";
import toast from "react-hot-toast";
type SidebarHeaderProps = {
  theme: string;
  toggleTheme: () => void;
};
export default function SidebarHeader({
  theme,
  toggleTheme,
}: SidebarHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Notes[]>([]);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const { folderName, folderId, filters } = useParams<{
    folderName: string;
    folderId: string;
    filters: "trash" | "archive" | "favorites";
  }>();

  const { searchQuery, setSearchQuery, loadNotes } = useNotes();
  // const { theme, toggleTheme } = useTheme();

  const handleCreateNote = async () => {
    if (filters) return;
    if (!folderId) return;

    const newNote = await createNote(folderId, "", "", false, false);

    await loadNotes(() => false, undefined, folderId);
    navigate(`/${folderName}/${folderId}/notes/${newNote}`);
    toast.success("Note created successfulyy!Yayyyyy!!");
  };

  const searchingNotes = (value: string) => {
    setSearchQuery(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(async () => {
      if (value.trim()) {
        const data = await searchNote(value);
        setResult(data);
        setShowResult(true);
      } else {
        setResult([]);
        setShowResult(false);
      }
    }, 400);
  };
  // const searchingNotes = (value: string) => {
  //   setSearchQuery(value);

  //   clearTimeout(timer);

  //   timer = window.setTimeout(async () => {
  //     if (value.trim()) {
  //       const data = await searchNote(value);
  //       setResult(data);
  //       setShowResult(true);
  //     } else {
  //       setResult([]);
  //       setShowResult(false);
  //     }
  //   }, 400);
  // };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Logo />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="
              w-9 h-9
              flex items-center justify-center
              rounded-full
              text-[var(--text-gray-400)]
              hover:text-[var(--text-white)]
              hover:bg-[var(--bg-hover)]
              transition-all duration-200
            "
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="
              w-9 h-9
              flex items-center justify-center
              rounded-full
              text-[var(--text-gray-400)]
              hover:text-[var(--text-white)]
              hover:bg-[var(--bg-hover)]
              transition-all duration-200
            "
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6 relative">
        {showSearch ? (
          <div
            className="relative w-[260px]"
            onBlur={() => setShowResult(false)}
            tabIndex={0}
          >
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => searchingNotes(e.target.value)}
              placeholder="Search notes..."
              className="
          w-full h-[40px]
          px-3 py-2.5
          rounded-lg
          bg-[var(--bg-input)]
          text-[var(--text-white)]
          text-sm
          placeholder:text-[var(--text-gray-500)]
          outline-none
          focus:ring-1 focus:ring-[var(--primary)]
          transition
        "
            />

            {showResult && result.length > 0 && (
              <div
                className="
            absolute top-full left-0 mt-2
            w-full
            bg-[var(--bg-input)]
            rounded-xl
            shadow-xl
            border border-[var(--border-gray-800)]
            max-h-60 overflow-y-auto
            z-50
          "
              >
                {result.map((note) => (
                  <div
                    key={note.id}
                    onMouseDown={() => {
                      setShowResult(false);
                      setSearchQuery("");
                      navigate(
                        `/${note.folder.name}/${note.folderId}/notes/${note.id}`,
                      );
                    }}
                    className="
                px-4 py-2
                hover:bg-[var(--note-active-bg)]
                cursor-pointer
                transition
              "
                  >
                    <div className="text-sm text-[var(--text-white)] truncate">
                      {note.title}
                    </div>
                    <div className="text-xs text-[var(--text-gray-400)] truncate">
                      {note.folder.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleCreateNote}
            className="
        flex justify-center items-center gap-2
        w-[260px] h-[40px]
        rounded-lg
        bg-[var(--primary)]
        text-[var(--text-white)]
        text-md font-medium
        hover:bg-[var(--primary-hover)]
        transition
      "
          >
            <Plus size={18} />
            New Note
          </button>
        )}
      </div>
    </>
  );
}
