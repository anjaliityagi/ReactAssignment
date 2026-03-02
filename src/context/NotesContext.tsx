import { createContext, useContext, useState } from "react";
import {
  fetchArchive,
  fetchDeleted,
  fetchFav,
  fetchNotes,
  type Notes,
} from "../api";

type Filter = "favorites" | "trash" | "archive";

type NotesContextType = {
  notes: Notes[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loadNotes: (filter?: Filter, folderId?: string) => Promise<void>;
  listLoading: boolean;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listLoading, setListLoading] = useState(false);

  const loadNotes = async (filter?: Filter, folderId?: string) => {
    setListLoading(true); //

    let data: Notes[] = [];

    if (filter === "favorites") {
      data = await fetchFav(true);
    } else if (filter === "archive") {
      data = await fetchArchive(true);
    } else if (filter === "trash") {
      data = await fetchDeleted(true);
    } else if (folderId) {
      data = await fetchNotes(folderId);
    }

    setNotes(data);
    setListLoading(false);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        searchQuery,
        setSearchQuery,
        loadNotes,
        listLoading,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
}
