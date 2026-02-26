import { createContext, useContext, useState } from "react";
import {
  fetchArchive,
  fetchDeleted,
  fetchFav,
  fetchNotes,
  type Notes,
  searchNote,
} from "../api";
//import { useParams } from "react-router-dom";

type Filter = "favorites" | "trash" | "archive";

type NotesContextType = {
  notes: Notes[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  loadNotes: (
    filter?: Filter,
    folderId?: string,
    searchQuery?: string,
  ) => Promise<void>;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  //   const { folderId } = useParams<{ folderId: string }>();

  const loadNotes = async (filter?: Filter, folderId?: string) => {
    let data: Notes[] = [];

    // if (query && query.trim() !== "") {
    //   data = await searchNote(query);
    // } else
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
  };

  return (
    <NotesContext.Provider
      value={{ notes, searchQuery, setSearchQuery, loadNotes }}
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
