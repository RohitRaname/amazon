import ChangeUserNameFormView from '../../../../../View/Pages/Review/createReview/form/changeUserNameFormView.js';
let View;

const component = document.querySelector(
  '.section-createReview'
);



const controlComponent = () => {};

if (component) {
  View = new ChangeUserNameFormView();
  View.add_handler_el(controlComponent);
}
