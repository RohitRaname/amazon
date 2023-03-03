import PositionElView from '../../Common/PositionComponent/base.js';

class Search_product_dropdown_view extends PositionElView {
  _parentel = document.querySelector(
    '.dropdown[data-positionel-name="search-products"]'
  );

  _positionbtn_el = document.querySelector(
    '[data-positionel-btn][data-positionel-name="search-products"]'
  );
  _searchbar = document.querySelector('.search-form-content');

  show() {
    this._parentel.dataset.active = true;
    // document.documentElement.style.overflowY = 'hidden';
    this.set_position_of_el();
    this.set_width_of_position_el();
  }

  set_position_of_el() {
    const { top, left, width, height } =
      this._positionbtn_el.getBoundingClientRect();
    this._parent_containerel.style.top =
      top + height + document.documentElement.scrollTop + -4 + 'px';
    this._parent_containerel.style.left = left + 'px';
  }

  set_width_of_position_el() {
    this._parent_containerel.style.width = this._searchbar.clientWidth + 'px';
    this._parent_containerel.style.maxWidth = 'unset';
  }
  _generate_markup(search_word) {
    const { highlights, title } = search_word;

    const html =
      highlights.length > 0
        ? `${highlights[0].texts
            .map(
              (el) =>
                `<span class="${el.type === 'hit' ? 'highlight' : ''}">
                ${el.value}
              </span>`
            )
            .join('')}`
        : `<span>${title}</span>`;

    return `<a href="/menu?q=${title.split(' ').join('+')}" class="list-item" data-value="${title}">
    <p>
        ${html}
      </p>
    </a>`;
  }

  render_and_show_position_el(dataArr) {
    if (dataArr.length === 0) return;
    const html = dataArr.map((el) => this._generate_markup(el)).join('');

    this._parentel.querySelector('.list').innerHTML = '';
    this._parentel
      .querySelector('.list')
      .insertAdjacentHTML('afterbegin', html);
  }
  // additional_funcs(){
  //   this.click_on_positionbtnel()
  // }
}

export default Search_product_dropdown_view;
