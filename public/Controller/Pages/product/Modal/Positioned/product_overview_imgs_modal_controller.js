import ProductImgsOverviewModal from '../../../../../View/Pages/product/Modal/Positioned/product_overview_imgs_modal_view.js';
let View;

const product_imgs_overview_modal = document.querySelector(
  '.modal[data-positionel-name="product-overview-imgs"]'
);

export const set_click_product_img_and_modal = (product_src) =>
  View.set_click_product_img_and_show_modal(product_src);

const control_modal = (action, data) => {};

if (product_imgs_overview_modal) {
  View = new ProductImgsOverviewModal();
  View.add_handler_el(control_modal);
}
