// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "../../../../menu-items";
import { UserRoles } from "@prisma/client";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
const currentUserRole = localStorage.getItem('role');
  let menus = menuItem;
if(currentUserRole === UserRoles.ADMIN || currentUserRole === UserRoles.OWNER || currentUserRole === UserRoles.DELIVERY){
  menus = menuItem.items;
}else{
  menus = menuItem.items.filter((item) => item.id !== 'pages')
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
