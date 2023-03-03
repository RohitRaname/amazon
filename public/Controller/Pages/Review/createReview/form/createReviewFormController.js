import CreateReviewFormView from '../../../../../View/Pages/Review/createReview/form/createReviewFormView.js';
let View;

const component = document.querySelector('.section-createReview');

const controlComponent = () => {};

if (component) {
  View = new CreateReviewFormView();
  View.add_handler_el(controlComponent);
}
