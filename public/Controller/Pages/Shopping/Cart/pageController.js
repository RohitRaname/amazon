import CartPageView from '../../../../View/Pages/Shopping/Cart/pageView.js';

let View;

const component = document.querySelector('.section-cart');

export const deleteCartItem = (cartItemEl)=> View.deleteCartItem(false,cartItemEl)
export const updateCartItemQty = (data)=> View.updateCartItemQty(data)

const controlComponent = () => {};

if (component) {
  View = new CartPageView();
  View.add_handler_el(controlComponent);
}
