import ProductPageView from '../../../View/Pages/product/product_page_view.js';
import { render_review_gallery_modal } from './Modal/Positioned/reviewGalleryModalController.js';
import { renderWindow } from './Modal/Static/searchQuesAns&ReviewModelController.js';

import { get } from '../../api/api.js';

const product_page = document.querySelector('.section-product');

export const control_page = async (action, data) => {
  if (action === 'show-clicked-review-overview-in-modal')
    render_review_gallery_modal(data);

  if (action === 'search-ques-and-reviews') {
    const [quesAns, reviews] = await Promise.all([
      get(
        `products/modelId/${data.modelId}/ques-ans/search?q=${data.search}&limit=12`
      ),
      get(
        `products/modelId/${data.modelId}/reviews/search?q=${data.search}&limit=12`
      ),
    ]);

    const quesAnsDocs = quesAns.data.docs;
    const reviewDocs = reviews.data.docs;

    renderWindow('all', { quesAnsDocs, reviewDocs });
    renderWindow('ques-ans', quesAnsDocs, true);
    renderWindow('reviews', reviewDocs, true);
  }
};

if (product_page) {
  const View = new ProductPageView();
  View.add_hander_page(control_page);
}
