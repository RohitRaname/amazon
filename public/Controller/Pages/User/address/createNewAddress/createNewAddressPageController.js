import CreateNewAddressPageView from '../../../../../View/Pages/User/address/createNewAddress/createNewAddressPageView.js';
let View;

const component = document.querySelector('.section-add-new-address');

const controlComponent = () => {};

if (component) {
  View = new CreateNewAddressPageView();
  View.add_handler_el(controlComponent);
}
