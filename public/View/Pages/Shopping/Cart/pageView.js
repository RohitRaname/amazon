import { del, patch, post } from '../../../../Controller/api/api.js';
import PageView from '../../../Common/pageView.js';

export default class CartPageView extends PageView {
  _pageEl = document.querySelector('body[data-page="cart"]');
  _parentel = document.querySelector('.section-cart');

  _checkoutBtn = this._parentel.querySelector('button[data-action="checkout"]');

  // header
  _selectAllItemsBtn = this._parentel.querySelector(
    'button[data-action="select-all-items"]'
  );
  _unselectAllItemsBtn = this._parentel.querySelector(
    'button[data-action="unselect-all-items"]'
  );

  // header cart items count
  _pageHeaderCartItemsCountEl = document.querySelector('.header-cart-qty');

  // left container
  _cartListEl = this._parentel.querySelector('.cart-items');
  _cartItems = [...this._parentel.querySelectorAll('.cart-item')];
  _addCartItemToListBtnClicked;

  // right container
  _cartItemsCount = this._parentel.querySelector('[data-cart-items-count]');
  _cartTotalAmountEl = this._parentel.querySelector('[data-cart-total-price]');

  // helper func
  _setCartItemState(cartItem, activeState) {
    cartItem.dataset.active = activeState;
    cartItem.querySelector('.btn-checkbox').dataset.active = activeState;
  }

  _updateCartTotalItemsCountAndTotalAmount() {
    const cartItems = [...this._parentel.querySelectorAll('.cart-item')].filter(
      (el) => el.dataset.active === 'true'
    );

    this._cartTotalAmountEl.textContent = cartItems
      .reduce((acc, el) => {
        const data = JSON.parse(el.dataset.data);
        const price =
          Number(data.price) * Number(data.qty) * this._userCurrencyRate;
        return acc + price;
      }, 0)
      .toFixed(2);

    const totalCartItemsCount = cartItems.reduce(
      (acc, el) => acc + Number(JSON.parse(el.dataset.data).qty),
      0
    );
    this._cartItemsCount.textContent = totalCartItemsCount;

    this._pageHeaderCartItemsCountEl.textContent = totalCartItemsCount;

    cartItems.length === 0
      ? this._checkoutBtn.classList.add('btn-disabled')
      : this._checkoutBtn.classList.remove('btn-disabled');
  }

  // handler func
  _selectUnselectAllCartItems(target) {
    if (
      !target.closest('button[data-action="select-all-items"]') &&
      !target.closest('button[data-action="unselect-all-items"]')
    )
      return;

    if (target.closest('button[data-action="select-all-items"]')) {
      this._cartItems.forEach((el) => this._setCartItemState(el, true));
    }
    if (target.closest('button[data-action="unselect-all-items"]')) {
      this._cartItems.forEach((el) => this._setCartItemState(el, false));
    }
    this._unselectAllItemsBtn.classList.toggle('hidden');
    this._selectAllItemsBtn.classList.toggle('hidden');
    this._updateCartTotalItemsCountAndTotalAmount();
  }
  _selectUnselectCartItem(target) {
    const checkboxBtn = target.closest('button[data-action="select-item"]');
    if (!checkboxBtn) return;

    let { active } = checkboxBtn.dataset;

    active = active === 'true' ? false : true;
    const cartItem = target.closest('.cart-item');

    this._setCartItemState(cartItem, active);

    this._updateCartTotalItemsCountAndTotalAmount();
  }

  deleteCartItem(target, optionalCartItem) {
    console.log(optionalCartItem);

    const deleteBtn =
      optionalCartItem || target.closest('button[data-action="delete-item"]');
    if (!deleteBtn) return;
    const cartItem = optionalCartItem || target.closest('.cart-item');

    const data = JSON.parse(cartItem.dataset.data);

    const { _id, title, qty } = data;

    this._cartListEl.insertAdjacentHTML(
      'afterbegin',
      `<p class="p-v-md border-b-l"><a class="btn-inline-span" href="${this._setProductUrl(
        title,
        _id
      )}">${title}</a> <span class="letter-s"> was removed from Shopping Cart. </span></p>`
    );

    del(`users/me/cart/${_id}/qty/${qty}`);

    cartItem.remove();

    this._updateCartTotalItemsCountAndTotalAmount();
  }
  _addCartItemToWishlist(target) {
    const addCartItemToListBtn = target.closest(
      'button[data-action="add-item-to-list"]'
    );

    if (addCartItemToListBtn) {
      this._addCartItemToListBtnClicked = addCartItemToListBtn;
      return;
    }

    const dropdownItem = target.closest('.list-item');
    if (
      !dropdownItem ||
      !target.closest(
        '.dropdown[data-positionel-name="add-product-to-wishlist-dropdown"]'
      )
    )
      return;

    console.log('dropdown', dropdownItem);

    const cartItem = target.closest('.cart-item');
    const wishlistName = JSON.parse(dropdownItem.dataset.data).wishlist.name;

    this._addCartItemToListBtnClicked.textContent = `Added to ${wishlistName}`;
  }

  updateCartItemQty(data) {
    const { cartItemEl, qty } = data;
    const cartItemData = JSON.parse(cartItemEl.dataset.data);
    patch(`users/me/cart/${cartItemData._id}/qty/${qty}`, { qty: qty });

    cartItemEl.dataset.data = JSON.stringify({
      ...cartItemData,
      qty: qty,
    });

    this._updateCartTotalItemsCountAndTotalAmount();
  }

  add_handler_el() {
    this._pageEl.addEventListener('click', async (e) => {
      const target = e.target;

      this._selectUnselectAllCartItems(target);
      this._selectUnselectCartItem(target);
      this.deleteCartItem(target);

      this._addCartItemToWishlist(target);

      // checkout cart items
      const checkoutBtn = target.closest('button[data-action="checkout"]');
      if (!checkoutBtn) return;

      checkoutBtn.classList.add('btn-disabled');

      const items = this._cartItems
        .filter((item) => item.dataset.active === 'true')
        .map((item) => JSON.parse(item.dataset.data));

      console.log(items);

      await post('users/me/shopping/cart/checkout', { items });
      location.assign('/me/checkout');
    });
  }
}
