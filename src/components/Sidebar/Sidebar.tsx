import SidebarRecents from "./SidebarRecents";

import SidebarFolders from "./SidebarFolders";
import SidebarMore from "./SidebarMore";
import SidebarHeader from "./SidebarHeader";
interface SidebarProps {
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
}
export default function Sidebar({
  selectedFolderId,
  setSelectedFolderId,
}: SidebarProps) {
  return (
    <div className="sidebarContainer">
      <SidebarHeader
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
      />

      <SidebarRecents />

      <SidebarFolders
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
      />

      <SidebarMore />
    </div>
  );
}
