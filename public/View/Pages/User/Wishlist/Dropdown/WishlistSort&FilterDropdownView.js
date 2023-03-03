import { get } from '../../../../../Controller/api/api.js';
import DropdownView from '../../../../Common/PositionComponent/DropdownView.js';

export default class WishlistSortFilterDropdownView extends DropdownView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="wishlist-filter-&-sort-dropdown"]'
  );


  _url = this._parentel.dataset.url;

  _queryObj = { filter: 'all', sort: 'default' };

  _activeSemiListItemEl(itemEl, semiListEl) {
    this._activeel_in_arr(itemEl, [
      ...semiListEl.querySelectorAll('.list-item'),
    ]);
  }

  async _handle_el(target) {
    const itemEl = target.closest('.list-item');
    if (!itemEl) return;

    const semiListEl = itemEl.closest('.semi-list');
    const { action } = semiListEl.dataset;
    const { value } = itemEl.dataset;

    // active selected itemEl
    this._activeSemiListItemEl(itemEl, semiListEl);

    // update query obj
    this._queryObj[action] = value;

    const queryString = Object.keys(this._queryObj)
      .map((el) => `${el}=${this._queryObj[el]}`)
      .join('&');
    // location.search = this.queryString;
    console.log('final-url', `${this._url}?${queryString}`);

    this.hide('click', this._parentel);
    const res = await get(`${this._url}?${queryString}`);
    const docs = res.data.docs;

    return this._handle('render-filter-docs-in-window', {docs,window:document.querySelector('.modal-window[data-active="true"]').dataset.window});
  }
}
