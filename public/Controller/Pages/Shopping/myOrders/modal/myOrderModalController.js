import MyOrderModalView from "../../../../../View/Pages/Shopping/myOrders/Modal/myOrderModalView.js";

let View;

const component = document.querySelector(
  '.section-myOrder'
);
// render filtered Productmenu items

const controlComponent = (action, data) => {};

export const renderFilterOrdersByDate = (data)=> View.renderFilterOrdersByDate(data)

if (component) {
  View = new MyOrderModalView();
  View.add_handler_el(controlComponent);
}
