import SetProfileCoverModalView from "../../../../../View/Pages/User/userProfile/myProfile/modal/setProfileCoverModalView.js";

let View;
const component = document.querySelector(
  '[data-positionel-name="upload-cover-photo"]'
);

const controlComponent = () => {};

if (component) {
  View = new SetProfileCoverModalView();
  View.add_handler_el(controlComponent);
}
