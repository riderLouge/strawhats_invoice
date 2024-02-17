// assets
import { IconKey } from "@tabler/icons";

// constant
const icons = {
  IconKey,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: "pages",
  title: "Admin Section",
  caption: "Empty",
  type: "group",
  children: [
    {
      id: "authentication",
      title: "Admin Access",
      type: "collapse",
      icon: icons.IconKey,

      children: [
        {
          id: "login3",
          title: "Login",
          type: "item",
          url: "/pages/login/login3",
          target: true,
        },
        // {
        //   id: "register3",
        //   title: "Registration",
        //   type: "item",
        //   url: "/pages/register/register3",
        //   target: true,
        // },
        {
          id: "util-create-Bill",
          title: "Delivery Stats",
          type: "item",
          url: "/utils/util-DeliveryStats",
          breadcrumbs: false,
        },
        {
          id: "util-Manage-Employes",
          title: "Manage Employees",
          type: "item",
          url: "/utils/util-ManageEmployes",
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default pages;
