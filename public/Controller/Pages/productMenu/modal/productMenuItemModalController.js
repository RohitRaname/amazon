import ProductMenuItemsModalView from '../../../../View/Pages/productMenu/modal/productMenuItemsModalView.js';

let View;

const component = document.querySelector('.section-productMenu');
// render filtered Productmenu items 
export const renderFilterDocs= (filterQueryOptions)=> View.renderFilterDocs(filterQueryOptions) 

const controlComponent = () => {};

if (component) {
  View = new ProductMenuItemsModalView();
  View.add_handler_el(controlComponent);
}
