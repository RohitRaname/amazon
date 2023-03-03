import ProductRatingsOverview from '../../../../View/Components/HoverCard/product_ratings_overview_modal.js';

const hovercard = document.querySelector(
  '.hovercard[data-positionel-name="product-ratings-overview"]'
);

let View;

const control_hovercard = (action, data) => {
  console.log(action, data);
};

if (hovercard) {
  View = new ProductRatingsOverview();
  View.add_handler_el(control_hovercard);
}
