import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import DeliveryStats from "../views/utilities/DeliveryStats";
import ManageEmployees from "../views/utilities/ManageEmployes";
import UtilitiesCreateSupplierBill from "../views/utilities/CreateSupplierInvoice";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("../views/dashboard/Default"))
);

// utilities routing
const UtilsItems = Loadable(lazy(() => import("../views/utilities/Items")));
const UtilsSuppliers = Loadable(
  lazy(() => import("../views/utilities/Suppliers"))
);
const UtilsShops = Loadable(lazy(() => import("../views/utilities/Shops")));
const UtilsCreateBill = Loadable(
  lazy(() => import("../views/utilities/CreateBill"))
);
const UtilsAddOrEditBills = Loadable(
  lazy(() => import("../views/utilities/AddOrEditBill"))
);

const UtilsAddOrEditSupplierBills = Loadable(
  lazy(() => import("../views/utilities/AddOrEditSupplierBill "))
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
      path: "/",
      children: [
        {
          path: "dashboard",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "items",
          element: <UtilsItems />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "suppliers",
          element: <UtilsSuppliers />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "shops",
          element: <UtilsShops />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "CreateBill",
          element: <UtilsCreateBill />,
        },
      ],
    },
    {
      path: "",
      children: [
        {
          path: "ManageEmployes",
          element: <ManageEmployees />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "DeliveryStats",
          element: <DeliveryStats />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "AddOrEditBills",
          element: <UtilsAddOrEditBills />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "AddOrEditSupplierBills",
          element: <UtilsAddOrEditSupplierBills />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "supplierInvoice",
          element: <UtilitiesCreateSupplierBill />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "delivery",
          element: <UtilsDelivery />,
        },
      ],
    },
  ],
};

export default MainRoutes;
