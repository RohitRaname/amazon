import ReviewPhotosGalleryModalView from '../../../../../View/Pages/product/Modal/Positioned/review_gallery_photos_modal_view.js';
import { loadReviews } from '../Static/reviewPhotosContainerController.js';

let View;

const review_photos_gallery_modal = document.querySelector(
  '.modal[data-positionel-name="reviews-photo-gallery"]'
);

export const render_review_gallery_modal = (datael) => View.show_modal(datael);

const control_modal = (action, data) => {
  if(action==='load-photo-review-docs')  loadReviews()
};

if (review_photos_gallery_modal) {
  View = new ReviewPhotosGalleryModalView();
  View.add_handler_el(control_modal);
}
