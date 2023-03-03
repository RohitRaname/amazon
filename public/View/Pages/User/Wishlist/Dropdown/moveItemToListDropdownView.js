import DropdownView from '../../../../Common/PositionComponent/DropdownView.js';

export default class MoveItemBwListDropdownView extends DropdownView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="move-item-to-list-dropdown"]'
  );

  // temporary variable
  _data;

  _generateMarkup(doc) {
    const { name, _id } = doc;
    return `<li class="list-item" data-value=${JSON.stringify({
      name: this._stringifyText(name),
      _id: _id,
    })}>${name}</li>`;
  }

  render(positionbtnData, loadData, positionbtnel) {
    this._data = positionbtnData;
    this._positionbtnel = positionbtnel;

    const wishlists = loadData.docs.filter(
      (el) => el._id !== this._data.fromWishlistId
    );

    if (wishlists.length === 0) {
      // this._parentel.querySelector('.positionel-content').style.minHeight="1.4rem"
      // this._parentel.querySelector('.positionel-content').style.minWidth="20rem";
      this._listEl.innerHTML = '';
      this._listEl.insertAdjacentHTML(
        'beforeend',
        `<li class="list-item no-click">No wishlist available to move</li>`
      );
    } else this.renderDocs(this._listEl, wishlists, true, false);
  }

  async _handle_el(target, handle) {
    const itemEl = target.closest('.list-item');
    if (!itemEl) return;
    let { value } = itemEl.dataset;
    value = JSON.parse(value);

    this.hide('click', this._parentel);

    handle('move-item-to-another-wishlist', {
      ...this._data,
      toWishlist: {
        name: this._parseText(value.name),
        _id: value._id,
      },
    });
  }
}
