const search = document.querySelector('.search-form');

export default class search_view {
  _parentel = document.querySelector('.search-form');
  _search_input = this._parentel.querySelector('input');
  _search_btn = this._parentel.querySelector('button[data-action="search"]');

  _clear_search_input() {
    this._search_input.value = '';
  }

  _search_product(handle) {
    this._search_input.addEventListener('input', (e) => {
      const product_name = this._search_input.value;
      if (product_name === '') return;
      handle('show-result-in-search-dropdown', product_name);
    });
  }

  _click_on_search_btn(handle) {
    this._search_btn.addEventListener('click', (e) => {
      this._search_input.value !== '';
      // handle('show-products-in-new-page', this._search_input.value);
      location.assign(
        `/menu?q=${this._search_input.value.split(' ').join('-')}`
      );
    });
  }

  _search_by_enter_btn(handle) {
    this._search_input.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'enter' && this._search_input.value !== '')
        // handle('show-products-in-new-page', this._search_input.value);
        location.assign(
          `/menu?q=${this._search_input.value.split(' ').join('-')}`
        );
    });
  }

  add_handler_search(handle) {
    this._search_product(handle);
    this._click_on_search_btn(handle);
    this._search_by_enter_btn(handle);
  }
}
