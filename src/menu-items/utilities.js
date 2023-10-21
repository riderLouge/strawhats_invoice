// assets
import {
  IconShoppingCart,
  IconTruckDelivery,
  IconFileInvoice,
  IconUsers,
} from "@tabler/icons";

// constant
const icons = {
  IconShoppingCart,
  IconTruckDelivery,
  IconFileInvoice,
  IconUsers,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: "utilities",
  title: "Utilities",
  type: "group",
  children: [
    {
      id: "util-typography",
      title: "Items",
      type: "item",
      url: "/utils/util-items",
      icon: icons.IconShoppingCart,
      breadcrumbs: false,
    },
    {
      id: "util-shops",
      title: "customers",
      type: "item",
      url: "/utils/util-shops",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
    {
      id: "util-Delivery",
      title: "Delivery",
      type: "item",
      url: "/icons/utils-delivery",
      icon: icons.IconTruckDelivery,
      breadcrumbs: false,
    },
    {
      id: "icons",
      title: "invoice",
      type: "collapse",
      icon: icons.IconFileInvoice,
      children: [
        {
          id: "util-create-Bill",
          title: "Create Bill",
          type: "item",
          url: "/utils/util-CreateBill",
          breadcrumbs: false,
        },
        {
          id: "util-view/Edit-Bill",
          title: "View / Edit Bill",
          type: "item",
          url: "/utils/util-AddOrEditBills",
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default utilities;
