import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createFolders,
  delFolder,
  editFolder,
  fetchFolders,
  type Folder,
} from "../../api";
interface SidebarFoldersProps {
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
}
export default function SidebarFolders({
  selectedFolderId,
  setSelectedFolderId,
}: SidebarFoldersProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  const [del, setDel] = useState(false);
  const [delIndex, setDelIndex] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders().then((data) => {
      setFolders(data);
      console.log("folders", data);
      console.log("selectedFolderId", selectedFolderId);

      if (!selectedFolderId && folders.length > 0) {
        setSelectedFolderId(folders[0].id);
      }
    });
  }, []);

  console.log(input);

  return (
    <div className="sidebarSection">
      <div className="sidebarSectionTitle, sidebarLogoRow">
        Folders
        <button
          className="sidebarSearchIcon "
          onClick={() => setShowInput(!showInput)}
        >
          <img src="src/assets/AddFolder.svg" alt="addFolder" />
        </button>
      </div>

      {showInput && (
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="inputFolder"
          />{" "}
          <button className="add" onClick={() => createFolders(input)}>
            +
          </button>
        </div>
      )}

      {folders.map((folder) => {
        return (
          <div
            key={folder.id}
            onClick={() => {
              setSelectedFolderId(folder.id);
              navigate(`/folders/${folder.id}`);
            }}
            className="sidebarItem sidebarLogoRow"
          >
            <div>
              <img src="src/assets/DocumentIcon.svg" />
              {edit && editIndex === folder.id ? (
                <div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></input>
                  <button onClick={() => editFolder(folder.id, input)}>
                    s
                  </button>
                </div>
              ) : (
                folder.name
              )}
            </div>{" "}
            <div>
              <button
                className="sidebarSearchIcon"
                onClick={() => {
                  setEdit(!edit);
                  setEditIndex(folder.id);
                }}
              >
                ed
              </button>

              <button
                className="sidebarSearchIcon"
                onClick={() => {
                  setDel(true);
                  setDelIndex(folder.id);

                  if (del && delIndex === folder.id) {
                    delFolder(folder.id);
                  }
                }}
              >
                del
              </button>
            </div>
          </div>
        );
      })}

      <div className="sidebarItem"></div>
    </div>
  );
}
