// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "../../../../menu-items";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

  let menus = menuItem;
  if (localStorage.getItem('role') !== "admin" && localStorage.getItem('role') !== "delivery") {
   menus = menuItem.items.filter((item) => item.id !== 'pages')
  }else{
    menus = menuItem.items;
  }

  const navItems = menus.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
