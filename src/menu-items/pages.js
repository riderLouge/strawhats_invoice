import { IconKey } from "@tabler/icons";
import { UserRoles } from "../utils/constants";


const getMenuItems = (userRole) => {
  if (userRole === UserRoles.ADMIN || userRole === UserRoles.OWNER) {
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
  } else if (userRole === UserRoles.DELIVERY) {
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

const getPages = (userRole) => {
  return {
    id: "pages",
    title: `${userRole ? userRole : 'Guest'} Section`,
    type: "group",
    children: getMenuItems(userRole),
  };
};

export default getPages;
