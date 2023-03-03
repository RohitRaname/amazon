import UpdateCartItemQtyDropdown from '../../../../../View/Pages/Shopping/Cart/Dropdown/updateCartItemQtyDropdown.js';
import { deleteCartItem, updateCartItemQty } from '../pageController.js';
import { deleteCheckoutItem,updateCheckoutItemQty} from '../../Checkout/pageController.js';

let View;

const component = document.querySelector(
  '.positionel[data-positionel-name="update-cart-item-qty-dropdown"]'
);
// render filtered Productmenu items

const controlComponent = (action, data) => {
  if (action === 'delete-cart-item') deleteCartItem(data.cartItemEl);
  if (action === 'update-cart-item-qty') updateCartItemQty(data);

  console.log(action)

  if (action === 'delete-checkout-item') deleteCheckoutItem(data);
  if (action === 'update-checkout-item-qty') updateCheckoutItemQty(data);
};

if (component) {
  View = new UpdateCartItemQtyDropdown();
  View.add_handler_el(controlComponent);
}

