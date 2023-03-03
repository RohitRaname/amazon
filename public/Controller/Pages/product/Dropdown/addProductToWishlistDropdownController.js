import addProductToWishlistDropdownView from '../../../../View/Pages/product/Dropdown/addProductToWishlistDropdownView.js';
import { post } from '../../../api/api.js';
import { showModal } from '../Modal/Positioned/add_product_to_wishlist_modal.js';

let View;

const dropdown = document.querySelector(
  '.dropdown[data-positionel-name="add-product-to-wishlist-dropdown"]'
);

const controlDropdown = async (action, data) => {

  // if (action === 'add-product-to-wishlist') {
  //   const resData = await post(
  //     `users/me/wishlists/${data.wishlist._id}/add-product`,
  //     data,
  //     false,
  //     true
  //   );
  //   if (resData.message === 'item-exist') data.type = 'item-exist';

  //   console.log(resData);
  //   showModal(data);
  // }
};

if (dropdown) {
  View = new addProductToWishlistDropdownView();
  View.add_handler_el(controlDropdown);
}
