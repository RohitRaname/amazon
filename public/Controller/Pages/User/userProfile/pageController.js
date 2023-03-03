import MyProfilePageView from '../../../../View/Pages/User/userProfile/myProfile/pageView.js';

const component = document.querySelector('.section-my-profile');
let View;

const controlComponent = () => {};

if (component) {
  View = new MyProfilePageView();
  View.add_handler_el(controlComponent);
}
