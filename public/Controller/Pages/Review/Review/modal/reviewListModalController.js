import ReviewListModalView from '../../../../../View/Pages/Review/Review/modal/reviewListModalView.js';
import { render_review_gallery_modal } from '../../../product/Modal/Positioned/reviewGalleryModalController.js';

let View;
const component = document.querySelector('.review-list-modal');

export const renderFilterReviewDocs = (filterQueryString) =>
  View.renderFilterReviewDocs(filterQueryString);
export const renderSearchReviews = (searchWord) =>
  View.renderSearchReviews(searchWord);

const controlComponent = (action, data) => {
  if (action === 'show-clicked-review-overview-in-modal')
    render_review_gallery_modal(data);
};

if (component) {
  View = new ReviewListModalView();
  View.add_handler_el(controlComponent);
}
