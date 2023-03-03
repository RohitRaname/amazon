import CreateNewWishlistModalView from '../../../../View/Pages/product/Form/create_new_shoppinglist_modal_view.js';

import { post } from '../../../api/api.js';

const create_new_shopping_list_modalel = document.querySelector(
  '.modal[data-positionel-name="create-new-shopping-list"]'
);

const control_modal = (action, data) => {
  console.log(action,data);


  if (action === 'submit-data') post('users/me/wishlistS',data);
};

if (create_new_shopping_list_modalel) {
  const View = new CreateNewWishlistModalView();
  View.add_handler_el(control_modal);
}
