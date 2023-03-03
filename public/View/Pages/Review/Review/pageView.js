import { activeel } from '../../../utils/domHelper.js';
import { get } from '../../../../Controller/api/api.js';

export default class ReviewPageView {
  _pageEl = document.querySelector('body[data-page="review"]');
  _parentel = document.querySelector('.section-review');

  _searchReviewInput = this._parentel.querySelector('.search-review-input');

  _reviewFilterDropdowns = [
    ...document
      .querySelector('.review-filter-dropdowns')
      .querySelectorAll('.dropdown'),
  ];

  add_handler_el(handle) {
    this._pageEl.addEventListener('click', (e) => {
      const target = e.target;

      // click on dropdown item so make filter review req
      if (target.closest('.list-item') && target.closest('.dropdown')) {
        activeel(
          [...target.closest('.dropdown').querySelectorAll('.list-item')],
          target.closest('.list-item')
        );

        let queryString = this._reviewFilterDropdowns.map((el) => {
          const dropdownActiveItem = el.querySelector(
            '.list-item[data-active="true"]'
          );
          return dropdownActiveItem.dataset.value;
        });

        queryString = queryString.filter((el) => el && el !== '').join('&');
        // location.search = queryString;

        handle('filter-queryString', {
          queryString,
          listItemClicked: target.closest('.list-item'),
        });
      }

      // click on search review btn
      if (target.closest('.search-review-btn')) {
        if (this._searchReviewInput.value === '') return;
        handle('search-reviews', this._searchReviewInput.value);
      }
    });
  }
}
