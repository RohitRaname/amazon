import UpdateAddressFormView from "../../../../../../View/Pages/User/address/managaAddress/form/updateAddressFormView.js"
let View;

const component = document.querySelector(
  '.modal[data-positionel-name="update-address"]'
);



const controlComponent = () => {};

if (component) {
  View = new UpdateAddressFormView();
  View.add_handler_el(controlComponent);
}
