import FormView from '../../../Common/PositionComponent/FormView.js';

export default class CreateNewWishlistModalView extends FormView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="create-new-shopping-list"]'
  );

  _form = this._parentel.querySelector('.form');
  _wishlistNameInputEl = this._parentel.querySelector(
    'input[name="wishlistName"]'
  );

  _first_contentel = this._parentel.querySelector('[data-first-content]');
  _second_contentel = this._parentel.querySelector('[data-second-content]');

  _wishlistTitleEl = this._second_contentel.querySelector(
    '.modal-shopping-list-name'
  );

  // product item in _second_contentel
  _item_addel = this._parentel.querySelector(
    '.modal-new-added-item-to-shopping-list'
  );

  // new added item component
  _item_imgel = this._item_addel.querySelector('img');
  _item_namel = this._item_addel.querySelector('.modal-item-name');
  _item_pricel = this._item_addel.querySelector('.modal-item-price');

  _reset_parentel() {
    this._first_contentel.dataset.active = true;
    this._second_contentel.dataset.active = false;
  }

  render(positionbtnElData, queryData) {
    console.log(positionbtnElData, queryData);
    this._positionbtnelData = positionbtnElData;

    this._wishlistNameInputEl.value = `Shopping list ${
      queryData.wishlistsCount + 1
    }`;
  }

  _beforeSubmitAddCode(data) {
    console.log(this._positionbtnelData);
    data.product = this._positionbtnelData.product;
  }

  _afterSubmitAddCode(data) {
    this._switch_positionel_content();
    this._wishlistTitleEl.textContent = data.wishlistName;
  }
}
