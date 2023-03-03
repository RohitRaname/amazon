import { activeel } from '../../utils/domHelper.js';
import { get } from '../../../Controller/api/api.js';

export default class PositionElView {
  _parentel;
  _parent_containerel;
  _parent_contentel;
  _parent_listel;
  _spinner;
  _positionbtn_el;

  _userCurrency =
    document.querySelector('body[data-user]') &&
    JSON.parse(document.querySelector('body').dataset.userCurrency);
  _userCurrencySymbol = this._userCurrency && this._userCurrency.symbol;
  _userCurrencyRate = this._userCurrency && Number(this._userCurrency.rate);

  _allChildPositionels;

  // handle-func
  _handle;

  // data which we get from positionbtn el that sometimes needed to add to submit data
  _positionbtnelData;

  _sectionEl = document.querySelector('section');
  _sectionElData =
    this._sectionEl &&
    this._sectionEl.dataset.data &&
    JSON.parse(this._sectionEl.dataset.data);

  // if form modal
  _form;

  _show_positionel_timeout_ids = [];
  _hide_positionel_timeout_ids = [];
  _previous_position_el;

  _positionelHasChildEl = false;
  _childPositionelClicked = false;

  _positionels = [
    ...document.querySelectorAll('.positionel[data-static="false"]'),
  ];
  _positionels_that_dontneed_class = [
    ...document.querySelectorAll(
      '.positionel[data-need-manually-created-class="false"]'
    ),
  ];

  // TWO TYPE OF POSITONAL
  // -- 1.that need own class=> like modal,dynamic dropdown => to do more work than just clicking link or getting data from db to show in container
  // -- 2.that don't need own class=> just show el having links to click or data that dont need to be fetch from db(simple dropdown,tooltip,simple hovercard)

  // these two type of positional el have two type
  // 1.positionel contain both the positionbtn(trigger) and the content (content not repeat in other pages)
  // 2.positionbtn btn and positionel are separate so no hinderance in overlay (content repeat in other pages)

  _reset_inputs() {}
  _reset_parentel() {}
  _reset() {
    this._childPositionelClicked = false;
    this._childPositionel = false;
    this._positionElClicked = false;
    if (!this._parentel) return;

    if (this._form) this._reset_inputs();
    this._reset_parentel();
  }

  _activeel_in_arr(targetel, elarr) {
    elarr.forEach((mov) => {
      mov.dataset.active = targetel === mov;
    });
  }

  _active_positionel(targetel) {
    if (this._childPositionelClicked) {
      this._childPositionel.dataset.active = true;
      return;
    }
    this._positionels.forEach((mov) => {
      mov.dataset.active = targetel === mov;
    });
  }

  set_width_of_position_el(positionbtnel, positionel) {
    if (positionel.getAttribute('data-set-positionbtn-width') !== 'true')
      return;

    positionel.querySelector('.positionel-container').style.width =
      positionbtnel.clientWidth + 2 + 'px';
  }

  set_position_of_el(positionbtn_el, positionel) {
    this.set_width_of_position_el(positionbtn_el, positionel);
    if (positionel.classList.contains('modal') || this._childPositionelClicked)
      return;

    if (positionel.hasAttribute('data-set-position-manual')) {
      return;
    }

    let { top, left, height, right } = positionbtn_el.getBoundingClientRect();

    const position_containerel = positionel.querySelector(
      '.positionel-container'
    );

    position_containerel.style.top =
      top + height + document.documentElement.scrollTop + 'px';

    const position = positionel.getAttribute('data-position');

    if (position === 'left') position_containerel.style.left = left + 'px';
    else if (position === 'right') {
      position_containerel.style.right =
        document.documentElement.clientWidth - right + 'px';
      position_containerel.style.left = 'unset !important';
    } else if (position === 'center'){

      position_containerel.style.left = left + 'px';
    }
    else if (position === 'top') {
      position_containerel.style.top =
        top +
        document.documentElement.scrollTop -
        position_containerel.clientHeight -
        positionbtn_el.clientHeight +
        'px';
      position_containerel.style.left = left + 'px';
    } else if (position === 'cover') {
      position_containerel.style.top = top + 'px';
      position_containerel.style.left = left + 'px';
    } else position_containerel.style.left = left + 'px';

    const positionType = positionel.getAttribute('data-position-type');

    if (positionType) {
      const positionTop =
        positionType === 'absolute'
          ? document.documentElement.scrollTop + top
          : top;
      console.log('in', positionTop);
      position_containerel.style.top = positionTop + 'px';
    }
  }

  // load render and then show new content not modal window (special case for base el)
  _switch_positionel_content() {
    // hide the active content
    const active_contentel = this._parentel.querySelector(
      '.positionel-content[data-active="true"]'
    );
    const unactive_contentel = this._parentel.querySelector(
      '.positionel-content[data-active="false"]'
    );

    active_contentel.dataset.active = false;

    this._spinner.classList.remove('hide');

    setTimeout(() => {
      this._spinner.classList.add('hide');
      unactive_contentel.dataset.active = true;
    }, 600);
  }

  _date(date) {
    return new Intl.DateTimeFormat('en-US').format(new Date(date));
  }

  _stringifyText(text) {
    return text && text.split(' ').join('-');
  }
  _parseText(text) {
    console.log('text', text);
    return text && text.split('-').join(' ');
  }

  _setProductUrl(title, id) {
    return `/${title.split(' ').join('-')}/${id}`;
  }

  _convertProductPrice(priceInDollar) {
    return this._userCurrencyRate * priceInDollar;
  }

  // convert price according to user currency
  _convertProductPriceStr(priceInDollar) {
    return `${this._userCurrencySymbol}${this._convertProductPrice(
      priceInDollar
    )}`;
  }

  _showSpinner(parentel) {
    parentel.setAttribute('data-hide-spinner', false);
  }
  _hideSpinner(parentel) {
    parentel.setAttribute('data-hide-spinner', true);
  }

  // get data then render component(withour main content, header is there) then hide spinner and show component inner content
  async _loadQueryDataAndRender(positionbtnElData, url, positionbtnel) {
    const res = await get(url);
    this.render(positionbtnElData, res.data, positionbtnel);
  }

  async _load_spinner_and_then_show_content(positionbtnel, parentel, data) {
    this._active_positionel(parentel);

    this._showSpinner(parentel);

    const queryObj = JSON.parse(parentel.dataset.query);
    const positionbtnElData =
      positionbtnel.dataset.data && JSON.parse(positionbtnel.dataset.data);
    console.log('query', queryObj);

    // automatically get data and render component
    await this._loadQueryDataAndRender(
      positionbtnElData,
      queryObj.url,
      positionbtnel
    );
    this._hideSpinner(parentel);
  }

  // item markup => list markup => render
  _generateMarkup() {}

  renderDocs(listEl, docs, clear_html = true, returnHtml = false) {
    if (clear_html) listEl.innerHTML = '';
    const html = docs.map((doc) => this._generateMarkup(doc)).join('');

    if (returnHtml) return html;
    listEl.insertAdjacentHTML('beforeend', html);
  }

  render(positionbtnel) {}

  boolean_converter(value) {
    return value === 'true' || value === true ? true : false;
  }

  get_data_from_targetbtn_parent_el_and_update_dropdown() {}

  hide(event, positionel) {
    positionel = positionel ? positionel : this._parentel;

    console.log('hide', event, positionel.dataset.positionelName);
    if (positionel.getAttribute('data-static') === 'true') return this._reset();

    const { showEvent, positionelName } = positionel.dataset;

    if (this._hide_positionel_timeout_ids.length > 2) return;

    if (showEvent === 'mouseover') {
      const hide_positionel_timeout_id = setTimeout(() => {
        // if (this._positionElClicked) {
        positionel.dataset.active = false;
        this._reset(positionel);
        this._hide_positionel_timeout_ids = [];

        this._childPositionel &&
          this._allChildPositionels.forEach((el) => {
            el.style.display = 'none';
            el.dataset.active = false;
            setTimeout(() => {
              el.style.display = 'block';
            }, 1000);
          });
        // }

        if (this._childPositionelClicked) positionel.dataset.active = false;

        // // when parent container hide we hide  child positional element along with it
        // if (this._positionelHasChildEl) {

        //   this._allChildPositionels.forEach(el=>{

        //     el.style.display = 'none';
        //     el.dataset.active = false;
        //     // setTimeout(() => {
        //     //   el.style.display = 'block';
        //     // }, 1000);
        //   })
        // }
      }, 450);

      this._hide_positionel_timeout_ids.push(hide_positionel_timeout_id);
    }

    // click event
    else {
      // if (this._positionElClicked) {
      positionel.dataset.active = false;
      this._reset(positionel);
      this._hide_positionel_timeout_ids = [];

      this._allChildPositionels &&
        this._allChildPositionels.forEach((el) => {
          el.style.display = 'none';
          el.dataset.active = false;
          setTimeout(() => {
            el.style.display = 'block';
          }, 1000);
        });
      // }

      if (this._childPositionelClicked) positionel.dataset.active = false;
    }

    document.documentElement.style.overflowY = 'auto';
  }
  show(positionbtnel, parentel, event) {
    // add code
    if (this._parentel) this._positionbtn_el = positionbtnel;

    if (this._show_positionel_timeout_ids.length > 1) return;

    // sometimes render func need data which comes from positionbtnel
    let data;
    if (positionbtnel.getAttribute('data-get-data') === 'sectionEl')
      data = JSON.parse(this._sectionEl.dataset.data);
    else if (positionbtnel.hasAttribute('data-data'))
      data = JSON.parse(positionbtnel.dataset.data);

    this.set_position_of_el(positionbtnel, parentel);
    if (event === 'mouseover') {
      const show_positionel_timeout_id = setTimeout(() => {
        this._show_positionel_timeout_ids = [];

        this.render();

        parentel.dataset.loadSpinner === 'true'
          ? this._load_spinner_and_then_show_content(
              positionbtnel,
              parentel,
              data
            )
          : this._active_positionel(parentel);
      }, 450);

      this._show_positionel_timeout_ids.push(show_positionel_timeout_id);
    }

    // click event with spinner to load
    else if (event === 'click' && parentel.dataset.loadSpinner === 'true') {
      this._load_spinner_and_then_show_content(positionbtnel, parentel, data);
    }

    // simple click with no spinner load
    else {
      if (!this._childPositionelClicked) this.render(positionbtnel, data);
      this._active_positionel(parentel);
    }

    if (parentel.classList.contains('modal'))
      document.documentElement.style.overflowY = 'hidden';
  }
  common_positionel_handler_func_conditions(
    event,
    target,
    positionbtnel,
    positionel,
    positionels,
    handle
  ) {
    if (
      (target.closest('.positionel-closebtn') ||
        target.closest('[data-positionel-hide-btn]')) &&
      event === 'click'
    )
      return this.hide(event, positionel);

    if (target.closest('.overlay') || target.closest('.overlay-t')) {
      // hide the child positionel
      if (this._childPositionelClicked)
        return this.hide(
          this._childPositionel.dataset.showEvent,
          this._childPositionel
        );

      return this.hide(event, positionel);
    }

    if (target.closest('[data-positionel-btn]')) {
      return this.show(
        positionbtnel,
        this._childPositionelClicked ? this._childPositionel : positionel,
        this._childPositionelClicked
          ? this._childPositionel.dataset.event
          : event
      );
    }

    if (target.closest('.positionel[data-active="true"]')) {
      return this._handle_el(target, handle);
    }
  }

  common_positionel_handler_func(event, handle) {
    document.documentElement.addEventListener(event, (e) => {
      const target = e.target;

      // if (event === 'mouseover') return;

      // separate parentel and non-parentel element

      // if(!this._parentel) return;

      if (target.closest('.positionel-manual-btn')) return;

      // handle static els(which are position absolute)
      if (
        !target.closest('[data-positionel-btn]') &&
        target.closest('[data-static="true"]') &&
        this._parentel &&
        this._parentel === target.closest('[data-static="true"]')
      )
        return this._handle_el(target, handle);

      let cur_positionel = target.closest('.positionel');
      const parentOfPositionBtnel = cur_positionel;
      let cur_positionbtnel = target.closest('[data-positionel-btn]');
      if (cur_positionbtnel)
        cur_positionel = document.querySelector(
          `.positionel[data-positionel-name="${cur_positionbtnel.dataset.positionelName}"]`
        );

      // when positionbtn inside positionel
      if (
        parentOfPositionBtnel &&
        cur_positionbtnel &&
        cur_positionel !== parentOfPositionBtnel
      ) {
        cur_positionel = document.querySelector(
          `.positionel[data-positionel-name="${cur_positionbtnel.dataset.positionelName}"]`
        );

        if (
          cur_positionel !== parentOfPositionBtnel &&
          parentOfPositionBtnel === this._parentel
        )
          this._handle_el(target, handle);
      }

      // positionel not hover or click
      if (!cur_positionel) {
        if (
          this._parentel &&
          this._parentel.dataset.active === 'true' &&
          event === this._parentel.dataset.showEvent
        ) {
          this.hide(event, this._parentel);
        }

        // hide previous positionel when click somewhat oytsude
        if (
          !this._parentel &&
          this._previous_position_el &&
          event === this._previous_position_el.dataset.showEvent
        ) {
          this.hide(event, this._previous_position_el);
        }
        return;
      }



      // set positionchild el if clicked
      const positionel_child_positionel =
        cur_positionel.getAttribute('data-child-positionel') === 'true'
          ? cur_positionel
          : false;

      if (positionel_child_positionel) {
        this._childPositionel = positionel_child_positionel;

        this._childPositionelClicked = true;
      } else {
        this._childPositionelClicked = false;
      }

      if (
        this._parentel &&
        this._parentel !==
          cur_positionel.closest('[data-child-positionel="false"]')
      )
        return;
      if (cur_positionel.dataset.showEvent !== event) return;

      if (
        !this._parentel &&
        cur_positionel.getAttribute('data-has-defined-class') === 'true'
      )
        return;

      // // check event of positionel to show up is same as required

      // // parentel that dont need class to show (just need to set active)

      if (
        !this._parentel &&
        cur_positionel.getAttribute('data-has-defined-class') === 'false'
      )
        this._previous_position_el = cur_positionel;

      if (!this._childPositionelClicked) this._positionElClicked = true;

      this.common_positionel_handler_func_conditions(
        event,
        target,
        cur_positionbtnel,
        cur_positionel,
        this._positionels,
        handle
      );
    });
  }

  ////////////////////////////////////////////////////////
  //  Need its own parentClass to perform actions
  ////////////////////////////////////////////////////////
  click_on_positionbtnel(handle) {
    this.common_positionel_handler_func('click', handle);
  }
  hover_on_positionbtnel(handle) {
    this.common_positionel_handler_func('mouseover', handle);

    // });
  }

  _baseDOMEls() {
    this._parent_containerel = this._parentel.querySelector(
      '.positionel-container'
    );
    this._parent_contentel = this._parentel.querySelector(
      '.positionel-content'
    );
    this._allChildPositionels = [
      ...this._parentel.querySelectorAll('[data-child-positionel="true"]'),
    ];

    // form_modal
    if (this._parentel.dataset.form === 'true')
      this._form = this._parentel.querySelector('.form');

    this._parent_listel = this._parentel.querySelector('.list');
    this._spinner = this._parentel.querySelector('.spinner');
    this._positionbtn_el = document.querySelector(
      `[data-positionel-btn][data-positionel-name="${this._parentel.getAttribute(
        'data-positionel-name'
      )}"]`
    );
  }

  // base positionel=> rewrite by if child-class write a new function

  // this func will trigger el that dont have manual defined class (like when dropdown item clicked ,then to set value in btn)
  _handle_el(target, handle) {
    const el = target.closest('.positionel');
    if (!el) return;

    const elType = el.getAttribute('data-positionel-type');

    if (elType === 'dropdown' && target.closest('.list-item')) {
      this._activeel_in_arr(target.closest('.list-item'), [
        ...el.querySelectorAll('.list-item'),
      ]);

      // if need to change positionbtn text
      if (el.getAttribute('data-change-positionbtn-text') === 'true') {
        const positionbtnel = document.querySelector(
          `[data-positionel-btn][data-positionel-name="${el.dataset.positionelName}"]`
        );

        const value = target.closest('.list-item').textContent;

        let positionbtntextEl = positionbtnel.querySelector('p')
          ? positionbtnel.querySelector('p')
          : positionbtnel;

        positionbtntextEl = positionbtntextEl.querySelector('[data-value]')
          ? positionbtntextEl.querySelector('[data-value]')
          : positionbtntextEl;

        positionbtntextEl.textContent = value
          .split('-')
          .map((el) => el.slice(0, 1).toUpperCase() + el.slice(1))
          .join(' ');

        el.dataset.active = false;
      }
    }
  }

  _additional_funcs() {}

  _set_interaction_func(handle) {
    const show = this._parentel.dataset.showEvent || 'click';

    show === 'click'
      ? this.click_on_positionbtnel(handle)
      : this.hover_on_positionbtnel(handle);
  }

  add_handler_el(handle) {
    this._handle = handle;

    if (this._parentel.dataset.static === 'false') this._baseDOMEls();

    this._set_interaction_func(handle);

    this._additional_funcs(handle);
  }
}
