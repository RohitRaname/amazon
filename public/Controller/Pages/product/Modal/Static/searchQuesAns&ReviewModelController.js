import ProductSearchQuesAnsAndReviewsModal from "../../../../../View/Pages/product/Modal/Static/searchQuesAns&ReviewsModalView.js";
const componentEl = document.querySelector(
  '.product-search-matching-ques-ans-and-reviews-modal'
);

let View;

export const renderWindow= (windowName,docs)=>View.render(windowName,docs,false)


const control_modal = () => {};

if (componentEl) {
  View = new ProductSearchQuesAnsAndReviewsModal();
  View.add_handler_el(control_modal);
}
