import AddressPageView from "../../../../../View/Pages/User/address/managaAddress/addressPageView.js";
let View;

const component = document.querySelector(
  '.section-manage-address'
);



const controlComponent = () => {};

if (component) {
  View = new AddressPageView();
  View.add_handler_el(controlComponent);
}
