import { post } from '../../../../Controller/api/api.js';
import DropdownView from '../../../Common/PositionComponent/DropdownView.js';

export default class addProductToWishlistDropdownView extends DropdownView {
  _parentel = document.querySelector(
    '.dropdown[data-positionel-name="add-product-to-wishlist-dropdown"]'
  );

  _listItemEls = [...this._parentel.querySelectorAll('.list-item')];
  _createNewWishlistBtn = this._parentel.querySelector(
    'button[data-positionel-name="create-new-shopping-list"]'
  );

  render(positionbtnel, data) {
    if (document.querySelector('.section-cart'))
      this._createNewWishlistBtn.classList.add('hidden');

    console.log(data);
    const product = data;
    this._listItemEls.forEach((item) => {
      item.dataset.data = JSON.stringify({
        product,
        ...JSON.parse(item.dataset.data),
      });
    });
    this._createNewWishlistBtn.dataset.data = JSON.stringify({
      product,
    });
  }

  _handle_el(target) {
    if (!document.querySelector('.section-cart')) return;
    const item = target.closest('.list-item');
    if (!item) return;

    const data = JSON.parse(item.dataset.data);

    post(`users/me/wishlists/${data.wishlist._id}/add-product`, data);
  }

  // set_width_of_position_el(positionbtnel, positionel) {
  //   positionel.querySelector('.positionel-container').style.width =
  //     positionbtnel.clientWidth * 0.9 + 2 + 'px';
  // }

  // set_position_of_el(positionbtn_el, positionel) {
  //   positionbtn_el = positionbtn_el.closest('button');

  //   this.set_width_of_position_el(positionbtn_el, positionel);
  //   const position_containerel = positionel.querySelector(
  //     '.positionel-container'
  //   );

  //   const { top, left, height } = positionbtn_el.getBoundingClientRect();

  //   position_containerel.style.top =
  //     top + height + document.documentElement.scrollTop + 'px';
  //   position_containerel.style.left = left + 'px';
  // }
}
