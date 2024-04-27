import dashboard from './dashboard';
import * as constants from '../utils/constants';
import pages from './pages';
import utilities from './utilities';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

let menuItems = {
  items: [dashboard, utilities, other]
};
console.log(constants.role, localStorage.getItem('role'))
if (constants.role === 'admin') {
  console.log('in');
  menuItems.items.splice(1, 0, pages);
}

export default menuItems;
