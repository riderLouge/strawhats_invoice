import { lazy } from "react";

// project imports
import Loadable from "../ui-component/Loadable";
import MinimalLayout from "../layout/MinimalLayout";
import { element } from "prop-types";
import ForgorPassword from "../views/pages/authentication/authentication3/forgorPassword";
import ResetPassword from "../views/pages/authentication/authentication3/ResetPassword";

// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import("../views/pages/authentication/authentication3/Login3"))
);
const AuthRegister3 = Loadable(
  lazy(() => import("../views/pages/authentication/authentication3/Register3"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: <AuthLogin3 />,
    },
    {
      path: "/register",
      element: <AuthRegister3 />,
    },
    {
      path: "/forgot-password",
      element: <ForgorPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ],
};

export default AuthenticationRoutes;
