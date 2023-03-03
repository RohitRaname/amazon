import { patch, del } from '../../../../Controller/api/api.js';

import ModalView from '../../../Common/PositionComponent/ModalView.js';
import { RatingIconsHtml } from './../../../Common/ratingIcons.js';

export default class WishlistPageView extends ModalView {
  _sectionEl = document.querySelector('.section-wishlist');
  _parentel = document.querySelector('.wishlistCurrent');
  _listWindowMessageEl = this._parentel
    .querySelector('.modal-window[data-window="list"]')
    .querySelector('.modal-window-message');

  _curWishlistId = JSON.parse(this._sectionEl.dataset.data)._id;

  _generateMarkup(doc, windowName) {
    if (windowName === 'list') {
      // href="/${title.split('-')}/${_id}"
      const { _id, title, rating, thumbnail, price, curVariant, ts } = doc;
      return `<div  class="wishlistCurrent-item g-m-1-max gap-md p-sm" data-item-id="${_id}" data-col="3">
        <img src="${thumbnail}" class="img-md" alt="">

        <!-- item details -->
        <div class="wishlistCurrent-item-details">
          <!-- title -->
          <a href="${this._setProductUrl(title,_id)}" class="btn-inline w-600">
            ${title}
          </a>

          <!-- ratings -->
          <div class="f-sl pointer" data-positionel-btn="" data-positionel-name="product-ratings-overview">
            <div class="product-rating-icons f f-ab">
              ${RatingIconsHtml(rating.value)}
            </div>
            <i class="fa fa-angle-down product-rating-arrow icon-lw blue" aria-hidden="true"></i>
            <p class="t-sm w-500 blue">${rating.count}</p>
          </div>

          <!-- price -->
          <p class="pt w-500">${price.unit}${price.value}</p>

          <!-- size & color -->
          <div class="box-with-v-line f-size-sm">
            <div>Size: <span>${curVariant.size}</span></div>
            <div>Colour: <span>${curVariant.color.name}</span></div>
          </div>
        </div>

        <!-- cta -->
        <div class="wishlistCurrent-cta mg-lw-all f-flex-1 mg-l">
          <p class="f-size-lw">
            Item added on <span>${new Date(ts).toLocaleString()}</span>
          </p>
          <button class="btn-primary-light btn-round btn-100" data-action="add-to-cart" data-data=${JSON.stringify(
            { _id: _id,qty:1 }
          )}  data-click-effect  
          data-automatic
          data-checkout="true"
          >
            Add to Cart
          </button>
          <div class="f-lw">
            <button class="btn-outline btn-lw btn-100 btn-round" data-action="move-to-another-wishlist" data-data=${JSON.stringify(
              {
                item: { _id: _id, thumbnail: thumbnail },
                fromWishlistId: this._curWishlistId,
              }
            )} data-positionel-btn data-positionel-name="move-item-to-list-dropdown">
              <span>Move</span>
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </button>
            <button class="btn-outline btn-lw btn-100 btn-round" data-action="delete-item" data-url="users/me/wishlists/${
              this._curWishlistId
            }/remove-product/${_id}" data-data=${JSON.stringify({
        itemId: _id,
        fromWishlistId: this._curWishlistId,
      })}>
              Delete
            </button>
          </div>
        </div>
      </div>`;
    }
  }

  // move wishlist item to another list
  async moveItemToAnotherWishlist(data) {
    const { fromWishlistId, toWishlist, item } = data;
    await patch(
      `users/me/wishlists/${fromWishlistId}/move-item-to-list/${toWishlist._id}`,
      { item: item }
    );
    this._listWindowMessageEl.classList.remove('hidden');
    this._listWindowMessageEl.textContent = `Moved to ${toWishlist.name}`;

    this._activeModalList
      .querySelector(`.wishlistCurrent-item[data-item-id="${item._id}"]`)
      .remove();
  }

  _handle_el(target) {
    // delete wishlist item
    if (target.closest('button[data-action="delete-item"]')) {
      const itemEl = target.closest('.wishlistCurrent-item');
      console.log(
        target.closest('button[data-action="delete-item"]').dataset.url
      );
      del(target.closest('button[data-action="delete-item"]').dataset.url);
      itemEl.remove();
    }
  }
}
