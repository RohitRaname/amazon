import CheckoutPageView from "../../../../View/Pages/Shopping/Checkout/pageView.js";
let View;

const component = document.querySelector(
  '.section-checkout'
);
// render filtered Productmenu items

const controlComponent = (action, data) => {
};

export const deleteCheckoutItem=(data)=> View.deleteCheckoutItem(data)
export const updateCheckoutItemQty=(data)=> View.updateCheckoutItemQty(data)

if (component) {
  View = new CheckoutPageView();
  View.add_handler_el(controlComponent);
}
