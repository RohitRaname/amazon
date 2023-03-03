import PositionElView from '../../../Common/PositionComponent/base.js';

export default class SortProductMenuItemsDropdownView extends PositionElView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="productMenu-sort-dropdown"]'
  );

  _handle_el(target, handle) {
    const dropdownItem = target.closest('.list-item');
    if (!dropdownItem) return;

    const { value } = dropdownItem.dataset;

    this._positionbtn_el.querySelector('[data-value]').textContent =
      dropdownItem.textContent;

    this.hide('click', this._parentel);
    handle('set-filter-parameter-in-productMenu-modal-query', {
      field: value,
      action: 'replace',
      type: 'sort',
    });
  }
}
