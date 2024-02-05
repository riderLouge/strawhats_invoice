import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import DeliveryStats from "../views/utilities/DeliveryStats";
import ManageEmployees from "../views/utilities/ManageEmployes";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("../views/dashboard/Default"))
);

// utilities routing
const UtilsItems = Loadable(lazy(() => import("../views/utilities/Items")));
const UtilsShops = Loadable(lazy(() => import("../views/utilities/Shops")));
const UtilsCreateBill = Loadable(
  lazy(() => import("../views/utilities/CreateBill"))
);
const UtilsAddOrEditBills = Loadable(
  lazy(() => import("../views/utilities/AddOrEditBill"))
);

const UtilsDelivery = Loadable(
  lazy(() => import("../views/utilities/Delivery"))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-items",
          element: <UtilsItems />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-shops",
          element: <UtilsShops />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-CreateBill",
          element: <UtilsCreateBill />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-ManageEmployes",
          element: <ManageEmployees />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-DeliveryStats",
          element: <DeliveryStats />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-AddOrEditBills",
          element: <UtilsAddOrEditBills />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "utils-delivery",
          element: <UtilsDelivery />,
        },
      ],
    },
  ],
};

export default MainRoutes;
