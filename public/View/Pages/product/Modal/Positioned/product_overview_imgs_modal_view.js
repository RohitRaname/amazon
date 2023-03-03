import ModalView from '../../../../Common/PositionComponent/ModalView.js';

export default class ProductImgsOverviewModal extends ModalView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="product-overview-imgs"]'
  );

  _positionbtn_el = document.querySelector(
    `[data-positionel-btn][data-positionel-name="product-overview-imgs"]`
  );

  _parent_containerel = this._parentel.querySelector('.modal-container');

  _cur_product_imgel = this._parentel.querySelector('.modal-gallery-cur-photo');



  render(positionbtn_el) {


    const product_img_clicked_src = positionbtn_el.querySelector('img').src;

    this._cur_product_imgel.src = product_img_clicked_src;

    // set cur-img relative preview img in side active
    [...this._parentel.querySelectorAll('.box')].forEach((box_el) => {
      const img = box_el.querySelector('img');
      box_el.dataset.active = img.src === product_img_clicked_src;
    });
  }

  change_cur_img_when_clicked_on_preview_imgs(target) {
    const preview_img_box = target.closest('.box ');
    if (!preview_img_box) return;

    this._activeel_in_arr(
      preview_img_box,
      this._parentel.querySelectorAll('.box')
    );

    this._cur_product_imgel.src = preview_img_box.querySelector('img').src;
  }

  click_on_content(target) {
    this.change_cur_img_when_clicked_on_preview_imgs(target);
  }
}
