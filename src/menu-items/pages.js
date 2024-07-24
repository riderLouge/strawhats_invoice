// assets
import { IconKey } from "@tabler/icons";

// constant
const icons = {
  IconKey,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const getMenuItems = () => {

  
  if (localStorage.getItem('role') === 'admin') {
    return [
      {
        id: 'util-create-Bill',
        title: 'Delivery Stats',
        type: 'item',
        url: '/DeliveryStats',
        breadcrumbs: false,
      },
      {
        id: 'util-Manage-Employes',
        title: 'Manage Employees',
        type: 'item',
        url: '/ManageEmployes',
        breadcrumbs: false,
      }
    ];
  } else if (localStorage.getItem('role') === 'delivery') {
    return [
      {
        id: 'util-create-Bill',
        title: 'Delivery Stats',
        type: 'item',
        url: '/DeliveryStats',
        breadcrumbs: false,
      }
    ];
  }

  return [];
};

const pages = {
  id: "pages",
  title: `${localStorage.getItem('role')} Section`,
  // caption: "Empty",
  type: "group",
  children: getMenuItems(),
  // children: [
  //   {
  //     id: "authentication",
  //     title: "Admin Access",
  //     type: "collapse",
  //     icon: icons.IconKey,
  //     children: getMenuItems(),
  //   },
  // ],
};

export default pages;
