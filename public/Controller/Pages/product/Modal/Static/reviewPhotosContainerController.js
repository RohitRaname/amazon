import ReviewPhotosModalView from "../../../../../View/Pages/product/Modal/Static/review_photos_modal_view.js";

let View;

const review_photos_modal = document.querySelector(
  '.product-reviews-container'
);

// load and insert
export const loadReviews= ()=>View.loadReviews()



const control_modal = (action, data) => {};

if (review_photos_modal) {
  View = new ReviewPhotosModalView();
  View.add_handler_el(control_modal);
}
