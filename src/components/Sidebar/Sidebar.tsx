import SidebarRecents from "./SidebarRecents";

import SidebarFolders from "./SidebarFolders";
import SidebarMore from "./SidebarMore";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  return (
    <div className="sidebarContainer">
      <SidebarHeader />

      <SidebarRecents />

      <SidebarFolders />

      <SidebarMore />
    </div>
  );
}
