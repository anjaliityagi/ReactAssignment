import SidebarRecents from "./SidebarRecents";

import SidebarFolders from "./SidebarFolders";
import SidebarMore from "./SidebarMore";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader />

      <SidebarRecents />

      <SidebarFolders />

      <SidebarMore />
    </div>
  );
}
