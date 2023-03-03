import SetProfileImgsDropdownView from "../../../../../View/Pages/User/userProfile/myProfile/tooltip/setUserProfileImgsDropdowView.js";

let View;
const component = document.querySelector(
  '[data-positionel-name="set-userprofile-imgs"]'
);

const controlComponent = () => {};

if (component) {
  View = new SetProfileImgsDropdownView();
  View.add_handler_el(controlComponent);
}
