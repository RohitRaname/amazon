import SortProductMenuItemsDropdownView from '../../../../View/Pages/productMenu/dropdown/sortProductMenuItemsDropdown.js';
import { renderFilterDocs } from '../modal/productMenuItemModalController.js';

let View;

const component = document.querySelector('.section-productMenu');
// render filtered Productmenu items

const controlComponent = (action, data) => {
  if (action === 'set-filter-parameter-in-productMenu-modal-query')
    renderFilterDocs(data);
};

if (component) {
  View = new SortProductMenuItemsDropdownView();
  View.add_handler_el(controlComponent);
}
