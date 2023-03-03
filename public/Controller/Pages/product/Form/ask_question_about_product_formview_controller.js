import AskQuestionAboutProductForm from '../../../../View/Pages/product/Form/ask_question_about_product_formview.js';
let View;

const ask_question_about_modal_form = document.querySelector(
  '.modal[data-positionel-name="ask-question-about-product-form"]'
);


const control_modal = () => {};

if (ask_question_about_modal_form) {
  View = new AskQuestionAboutProductForm();
  View.add_handler_el(control_modal);
}
