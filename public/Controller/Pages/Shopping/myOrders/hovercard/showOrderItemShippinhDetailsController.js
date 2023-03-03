import ShowOrderItemShippingDetailsHoverCardView from '../../../../../View/Pages/Shopping/myOrders/hovercard/showOrderItemShippingDetailsHovercardView.js';

let View;

const component = document.querySelector('.section-myOrder');
// render filtered Productmenu items

const controlComponent = (action, data) => {};

if (component) {
  View = new ShowOrderItemShippingDetailsHoverCardView();
  View.add_handler_el(controlComponent);
}
