import ProductMenuPageView from '../../../View/Pages/productMenu/pageView.js';
import { renderFilterDocs } from './modal/productMenuItemModalController.js';

let View;

const component = document.querySelector('.section-productMenu');
const controlComponent = (action, data) => {
  if (action === 'set-filter-query-in-product-menu-items-modal')
    renderFilterDocs(data);

};

if (component) {
  View = new ProductMenuPageView();
  View.add_handler_el(controlComponent);
}
