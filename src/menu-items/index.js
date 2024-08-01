import { useContext } from 'react';
import dashboard from "./dashboard";
import * as constants from "../utils/constants";
import getPages from "./pages";
import utilities from "./utilities";
import other from "./other";
import { useOverAllContext } from '../context/overAllContext';

// ==============================|| MENU ITEMS ||============================== //
const MenuItems = () => {
  const { userRole } = useOverAllContext();

  let menuItems = {
    items: [dashboard, getPages(userRole), utilities, other],
  };

  return menuItems;
};

export default MenuItems;
