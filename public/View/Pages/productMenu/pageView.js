import { activeel, unActiveAllEls } from '../../utils/domHelper.js';
export default class ProductMenuPageView {
  _parentEl = document.querySelector('.section-productMenu');
  _userCurrencyRate =
    document.querySelector('body[data-user-currency]') &&
    JSON.parse(document.querySelector('body').dataset.userCurrency).rate;

  _filterOptionsContainer = this._parentEl.querySelector('.productMenu-filter');

  _setPriceRangeContainer = this._parentEl.querySelector(
    '.productMenu-set-price-range'
  );
  _setPriceRangeInputEls = [
    ...this._setPriceRangeContainer.querySelectorAll('input'),
  ];
  _setMinPriceInputEl = this._setPriceRangeContainer.querySelector(
    'input[data-min-price]'
  );
  _setMaxPriceInputEl = this._setPriceRangeContainer.querySelector(
    'input[data-max-price]'
  );

  // set filter query in search bar
  _filterProductMenuItems(target, handle) {
    let selectedFilterQuery;

    if (
      target.closest('[data-filter]') ||
      target.closest('button[data-action="set-price-range"]')
    ) {
      const filterEl =
        target.closest('[data-filter]') ||
        target.closest('button[data-action="set-price-range"]');

      const filterOptionsList = filterEl.closest('.productMenu-filter-by');

      // CSS STUFFF -------------------------------------------------
      if (target.closest('[data-filter]')) {
        if (filterEl.dataset.active === 'false') {
          // active filter El in its option list
          activeel([...filterOptionsList.querySelectorAll('li')], filterEl);

          // if price filter option clicked then set range in its input els
          if (
            filterOptionsList.classList.contains('productMenu-filter-by-price')
          ) {
            const priceRange =
              filterEl.querySelector('[data-value]').textContent;

            if (priceRange.includes('-')) {
              const priceRangeArr = priceRange.split('-');
              this._setMinPriceInputEl.value = priceRangeArr[0];
              this._setMaxPriceInputEl.value = priceRangeArr[1];
            } else {
              this._setMaxPriceInputEl.value = priceRange;
              this._setMinPriceInputEl.value = 0;
            }
          }

          // if checkbox clicked then active it
          if (filterEl.querySelector('.btn-checkbox'))
            activeel(
              [...filterOptionsList.querySelectorAll('.btn-checkbox')],
              filterEl.querySelector('.btn-checkbox')
            );

          // set filter El span primary color
          if (filterOptionsList.hasAttribute('data-set-text-color')) {
            [...filterOptionsList.querySelectorAll('li span')].forEach((el) =>
              el.classList.remove('primary')
            );
            filterEl.querySelector('span').classList.add('primary');
          }
        } else {
          unActiveAllEls([...filterOptionsList.querySelectorAll('li')]);

          // if checkbox exist then unactive it also
          if (filterEl.querySelector('.btn-checkbox'))
            filterEl.querySelector('.btn-checkbox').dataset.active = false;

          if (filterOptionsList.hasAttribute('data-set-text-color')) {
            filterEl.querySelector('span').classList.remove('primary');
          }

          let filterQueryField = filterEl.dataset.filter.split('&').map(el=>el.split('=')[0])
          
          


          return handle('set-filter-query-in-product-menu-items-modal', {
            set: false,
            queryStr: filterQueryField,
          });
        }
      }

      // -------------------------------------------------------

      // FILTER QUERY -----------------------------------------
      if (target.closest('[data-filter]')) {
        const { filter } = filterEl.dataset;
        selectedFilterQuery = filter;
      }

      if (target.closest('button[data-action="set-price-range"]')) {
        selectedFilterQuery = this._setPriceRangeInputEls.filter(
          (el) =>
            el.value &&
            el.value !== '' &&
            Number(el.value) &&
            Number(el.value) > 0
        );

        if (
          selectedFilterQuery.length === 0 ||
          Number(this._setMinPriceInputEl.value) >
            Number(this._setMaxPriceInputEl.value)
        )
          return;

        selectedFilterQuery = selectedFilterQuery
          .map(
            (el) =>
              `${el.name}=${
                this._userCurrencyRate
                  ? Math.floor(
                      Number(el.value) / Number(this._userCurrencyRate)
                    )
                  : el.value
              }`
          )
          .join('&');
      }

      handle('set-filter-query-in-product-menu-items-modal', {
        set: true,
        queryStr: selectedFilterQuery,
      });
    }
  }

  add_handler_el(handle) {
    this._parentEl.addEventListener('click', (e) => {
      const target = e.target;

      this._filterProductMenuItems(target, handle);
    });
  }
}
