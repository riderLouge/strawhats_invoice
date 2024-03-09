// assets
import { IconClipboardList, IconBell } from "@tabler/icons";

// constant
const icons = { IconClipboardList, IconBell };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: "sample-docs-roadmap",
  type: "group",
  children: [
    {
      id: "Notification",
      title: "Notification",
      type: "item",
      url: "",
      icon: icons.IconBell,
      breadcrumbs: false,
    },
    {
      id: "Suppliers",
      title: "Suppliers",
      type: "item",
      url: "/suppliers",
      icon: icons.IconClipboardList,
      breadcrumbs: false,
    },
  ],
};

export default other;
