// assets
import { UserRoles } from "@prisma/client";
import { IconKey } from "@tabler/icons";

// constant
const icons = {
  IconKey,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const getMenuItems = () => {

  console.log(localStorage.getItem('role') )
  if (localStorage.getItem('role') === UserRoles.ADMIN || localStorage.getItem('role') === UserRoles.OWNER) {
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
  } else if (localStorage.getItem('role') === UserRoles.DELIVERY) {
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
