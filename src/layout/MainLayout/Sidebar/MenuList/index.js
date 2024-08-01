import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import NavGroup from "./NavGroup";
import getMenuItems from "../../../../menu-items";
import { UserRoles } from "../../../../utils/constants";
import { useOverAllContext } from "../../../../context/overAllContext";

const getFilteredMenus = (menuItems, userRole) => {
  if (userRole === UserRoles.ADMIN || userRole === UserRoles.OWNER) {
    return menuItems;
  }

  if (userRole === UserRoles.DELIVERY) {
    console.log(menuItems)
    return menuItems.map((menu) => {
      if (menu.id === 'utilities') {
        return {
          ...menu,
          children: menu.children.filter((child) => child.title !== 'Delivery'),
        };
      }
      return menu;
    }).filter((item) => (item.id !== 'sample-docs-roadmap' && item.id !== 'dashboard'));
  }

  return menuItems.filter((item) => item.id !== 'pages');
};

const MenuList = () => {
  const { userRole } = useOverAllContext();
  const menuItems = useMemo(() => getMenuItems(userRole).items, [userRole]);
  const filteredMenus = useMemo(() => getFilteredMenus(menuItems, userRole), [menuItems, userRole]);

  const navItems = filteredMenus.map((item) => {
    if (item.type === "group") {
      return <NavGroup key={item.id} item={item} />;
    }

    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Menu Items Error
      </Typography>
    );
  });

  return <>{navItems}</>;
};

export default MenuList;
