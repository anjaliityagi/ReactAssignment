import axios from "axios";

const api = axios.create({
  baseURL: "https://nowted-server.remotestate.com",
});
export interface Folder {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  isFavorite: true;
  isArchived: true;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  preview: string;
  folder: Folder;
}

export interface RecentNotes {
  title: string;
  preview: string;
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

//export const fetchRecents=async (): Promise<
