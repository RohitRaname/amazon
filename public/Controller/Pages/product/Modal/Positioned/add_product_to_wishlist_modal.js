import AddProductToWishlistModalView from '../../../../../View/Pages/product/Modal/Positioned/add_product_to_wishlist_modal_view.js';
import { post } from '../../../../api/api.js';

let View;

const product_imgs_overview_modal = document.querySelector(
  '.modal[data-positionel-name="add-product-to-wishlist-modal"]'
);


export const showModal= (data)=> View.showManually(data)

const control_modal = async (action, data) => {
  console.log(action, data);
};

if (product_imgs_overview_modal) {
  View = new AddProductToWishlistModalView();
  View.add_handler_el(control_modal);
}
