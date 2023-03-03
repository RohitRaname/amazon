import ProductQuesModalView from '../../../../../View/Pages/product/Modal/Static/quesAnsModalView.js';

const modal = document.querySelector(
  '.product-ques-ans'
);

let View;

const control_modal = () => {};

if (modal) {
  View = new ProductQuesModalView();
  View.add_handler_el(control_modal);
}
