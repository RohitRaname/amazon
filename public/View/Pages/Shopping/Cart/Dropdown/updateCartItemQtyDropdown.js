import PositionElView from '../../../../Common/PositionComponent/base.js';
import { patch, del } from '../../../../../Controller/api/api.js';

export default class UpdateCartItemQtyDropdown extends PositionElView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="update-cart-item-qty-dropdown"]'
  );

  _handle_el(target, handle) {
    const dropdownItem = target.closest('.list-item');
    if (!dropdownItem) return;

    const { value, action } = dropdownItem.dataset;

    const cartItemData = JSON.parse(this._positionbtn_el.closest('.item').dataset.data);

    const { _id: cartItemId, qty } = cartItemData;

    this._activeel_in_arr(dropdownItem, [
      ...this._parentel.querySelectorAll('.list-item'),
    ]);

    if (action === 'delete-cart-item') {
      handle('delete-cart-item', {
        cartItemEl: this._positionbtn_el.closest('.cart-item'),
      });
      return this.hide('click', this._parentel);
    }
    if (action === 'delete-checkout-item') {
      handle('delete-checkout-item', {
        itemEl: this._positionbtn_el.closest('.checkout-item'),
        qty,
      });
      return this.hide('click', this._parentel);
    }

    this._positionbtn_el.querySelector('[data-value]').textContent =
      dropdownItem.textContent;

    if (this._positionbtn_el.closest('.cart-item')) {
      handle('update-cart-item-qty', {
        cartItemEl: this._positionbtn_el.closest('.cart-item'),
        qty: value,
      });
    }
    if (this._positionbtn_el.closest('.checkout-item')) {

      console.log('qty',qty)
      console.log('value',value)
      handle('update-checkout-item-qty', {
        itemEl: this._positionbtn_el.closest('.checkout-item'),
        newQty: value,
        delta: Number(qty) - Number(dropdownItem.dataset.value),
      });
    }

    this.hide('click', this._parentel);
  }
}
