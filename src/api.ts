import axios from "axios";

const api = axios.create({
  baseURL: "https://nowted-server.remotestate.com",
});
export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Notes {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  preview: string;
  folder: Folder;
}
export interface Note {
  folderId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  folder: Folder;
}
export interface RecentNotes {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  preview: string;
  folder: Folder;
}

export const fetchRecents = async (): Promise<RecentNotes[]> => {
  const res = await api.get("/notes/recent");
  return res.data.recentNotes;
};

export const fetchFolders = async (): Promise<Folder[]> => {
  const res = await api.get("/folders");
  return res.data.folders;
};

export const createFolders = async (name: string): Promise<Folder[]> => {
  try {
    const res = await api.post("/folders", { name });
    console.log(res.data);

    return res.data.folders;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const editFolder = async (id: string, name: string) => {
  const res = await api.patch(`/folders/${id}`, { name });
  console.log(res.data);
};
export const delFolder = async (id: string) => {
  const res = await api.delete(`/folders/${id}`);
  console.log(res.data);
};

export const fetchNotes = async (id: string): Promise<Notes[]> => {
  const res = await api.get(`/notes?folderId=${id}`);
  return res.data.notes;
};

export const createNote = async (
  folderId: string,
  title: string,
  content: string,
  isArchived: false,
  isFavorite: false,
): Promise<Note> => {
  const res = await api.post("/notes", {
    folderId,
    title,
    content,
    isArchived,
    isFavorite,
  });
  return res.data.id;
};

export const updateNote = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    isFavorite?: boolean;
    isArchived?: boolean;
  },
) => {
  try {
    const res = await api.patch(`/notes/${id}`, data);
    return res.data.note;
  } catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const res = await api.get(`/notes/${noteId}`);
  return res.data.note;
};

export const fetchFav = async (isFavorite: boolean): Promise<Notes[]> => {
  const res = await api.get(`/notes?favorite=${isFavorite}`);
  return res.data.notes;
};

export const fetchArchive = async (isArchive: boolean): Promise<Notes[]> => {
  const res = await api.get(`/notes?archived=${isArchive}`);
  return res.data.notes;
};

export const fetchDeleted = async (deleted: boolean): Promise<Notes[]> => {
  const res = await api.get(`/notes?deleted=${deleted}`);
  return res.data.notes;
};

export const deleteNote = async (noteId: string) => {
  const res = await api.delete(`notes/${noteId}`);
  console.log(res.data);
};

export const restoreNote = async (noteId: string) => {
  await api.post(`/notes/${noteId}/restore`);
  return null;
};
