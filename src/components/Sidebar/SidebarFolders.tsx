import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFolders,
  delFolder,
  editFolder,
  fetchFolders,
  type Folder,
} from "../../api";

export default function SidebarFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState("");
  //const [del, setDel] = useState(false);
  //const [delIndex, setDelIndex] = useState("");
  const navigate = useNavigate();

  const { folderId } = useParams<{ folderId: string }>();

  useEffect(() => {
    fetchFolders().then((data) => {
      setFolders(data);
      console.log("folders", data);

      if (!folderId && data.length > 0) {
        navigate(`/folders/${data[0]?.id}`);
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
            <Plus size={18} />
          </button>
        </div>
      )}

      {folders.map((folder) => {
        return (
          <div
            key={folder.id}
            onClick={() => {
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
                  delFolder(folder.id);
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
