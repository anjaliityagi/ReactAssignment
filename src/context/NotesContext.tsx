/* eslint-disable */
import { createContext, useCallback, useContext, useState } from "react";
import {
  fetchArchive,
  fetchDeleted,
  fetchFav,
  fetchNotes,
  type Notes,
  fetchRecents,
  type RecentNotes,
} from "../api";

type Filter = "favorites" | "trash" | "archive";

type NotesContextType = {
  notes: Notes[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  loadNotes: (
    filter?: Filter,
    folderId?: string,
    page?: number,
    limit?: number,
    append?: boolean,
  ) => Promise<Notes[]>;
  listLoading: boolean;
  loadRecents: () => Promise<void>;
  loading: boolean;
  recentNotes: RecentNotes[];
  setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [recentNotes, setRecentNotes] = useState<RecentNotes[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecents = useCallback(async () => {
    setLoading(true);
    const data = await fetchRecents();
    setRecentNotes(data);
    setLoading(false);
  }, []);

  const loadNotes = useCallback(
    async (
      filter?: Filter,
      folderId?: string,
      page: number = 1,
      limit: number = 10,
      append: boolean = false,
    ) => {
      setListLoading(true);

      let data: Notes[] = [];

      if (filter === "favorites") {
        data = await fetchFav(true, page, limit);
      } else if (filter === "archive") {
        data = await fetchArchive(true, page, limit);
      } else if (filter === "trash") {
        data = await fetchDeleted(true, page, limit);
      } else if (folderId) {
        data = await fetchNotes(folderId, page, limit);
      }

      if (append) {
        setNotes((prev) => [...prev, ...data]);
      } else {
        setNotes(data);
      }

      setListLoading(false);
      return data;
    },
    [],
  );

  return (
    <NotesContext.Provider
      value={{
        notes,
        searchQuery,
        setSearchQuery,
        loadNotes,
        listLoading,
        setNotes,
        loadRecents,
        loading,

        recentNotes,
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
