import MyOrdersPageView from "../../../../View/Pages/Shopping/myOrders/pageView.js";
let View;

const component = document.querySelector(
  '.section-myOrder'
);
// render filtered Productmenu items

const controlComponent = (action, data) => {
};



if (component) {
  View = new MyOrdersPageView();
  View.add_handler_el(controlComponent);
}
