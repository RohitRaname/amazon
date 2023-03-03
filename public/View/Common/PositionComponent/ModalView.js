import { get } from '../../../Controller/api/api.js';
import { contains, replaceClass } from '../../utils/domHelper.js';
import PositionElView from './base.js';

class ModalView extends PositionElView {
  _parentel;
  _parent_containerel;
  _parentElHasChildPositionEl;

  _windowEls;
  _windowTabs;

  _activeWindow;
  _activeModalList;

  // active Window dataAttr
  // _url;
  // _docsLeft;
  // _page;
  // _limit;

  show_modal(datael) {
    this.show(datael, this._parentel, 'click');
  }

  _switchWindow(windowName) {
    if (!windowName) return;

    // active click section
    this._windowEls.forEach((el) => {
      el.dataset.active = el.dataset.window === windowName;
    });

    // active click btn
    if (this._windowTabs)
      this._windowTabs.forEach((el) => {
        el.dataset.active = el.dataset.window === windowName;
      });

    if (this._activeWindow) {
      this._activeWindow = this._parentel.querySelector(
        '.modal-window[data-active="true"]'
      );
      this._activeModalList = this._parentel.querySelector(
        '.modal-window[data-active="true"] .modal-list'
      );

      console.log(
        'initial-docs-load',
        this._activeWindow.getAttribute('data-initial-docs-load')
      );

      if (
        this._activeWindow.getAttribute('data-initial-docs-load') === 'false'
      ) {
        this._loadDocsAndRender(this._generateUrl(false));
        this._activeWindow.setAttribute('data-initial-docs-load', true);
      }
    }
  }

  _getWindowListEl(windowName) {
    return this._parentel
      .querySelector(`modal-window[data-window=${windowName}]`)
      .querySelector('.modal-list');
  }

  _reset_parentel() {
    setTimeout(() => {
      if (this._windowEls)
        this._windowEls.forEach((el, i) => {
          el.dataset.active = i === 0;
        });

      if (this._windowTabs)
        this._windowTabs.forEach((el, i) => {
          el.dataset.active = i === 0;
        });
    }, 450);
  }

  // add new query parameter or replace existing query parameter with update one
  _updateModalFilterQuery(newFilterQuery) {
    console.log(newFilterQuery);

    let queryField;
    let { filterQuery } = this._activeWindow.dataset;
    filterQuery = filterQuery.split('&');

    queryField = newFilterQuery.split('&').map((el) => {
      if (el.includes('[')) return el.split('[')[0];
      else return el.split('=')[0];
    });

    queryField.forEach((field) => {
      filterQuery = filterQuery.filter((el) => !el.includes(field));
    });

    filterQuery =
      filterQuery.slice(0, 1) === '&' ? filterQuery.slice(1) : filterQuery;

    let windowFilterQuery = `${filterQuery.join('&')}&${newFilterQuery}`;
    windowFilterQuery =
      windowFilterQuery.slice(0, 1) === '&'
        ? windowFilterQuery.slice(1)
        : windowFilterQuery;

    this._activeWindow.dataset.filterQuery = windowFilterQuery;
  }

  // action,field
  _updateModalSortQuery(sortObj) {
    const { action, field } = sortObj;

    let finalSortQuery;
    if (action === 'replace') finalSortQuery = field;
    else if (action === 'add')
      finalSortQuery =
        this._activeWindow.dataset.sort === ''
          ? field
          : this._activeWindow.dataset.sort + `,${field}`;
    else if (action === 'remove') finalSortQuery = '';

    this._activeWindow.dataset.sort = finalSortQuery;
  }

  // remove parameter from filter query
  _removeParameterFromFilterQuery(parameterName) {
    const parameterNameArr = Array.isArray(parameterName)
      ? parameterName
      : [parameterName];

    parameterNameArr.forEach((str) => {
      this._activeWindow.dataset.filterQuery =
        this._activeWindow.dataset.filterQuery
          .split('&')
          .filter((el) => !el.includes(str))
          .join('&');
    });
  }

  _generateUrl(needCountUrl) {
    const { url, limit, page, filterQuery, sort, searchQuery } =
      this._activeWindow.dataset;

    return `${url}${needCountUrl ? '/count' : ''}?${
      page ? `page=${page}` : ''
    }${limit ? `&limit=${limit}` : ''}${filterQuery ? `&${filterQuery}` : ''}${
      searchQuery ? `&q=${searchQuery}` : ''
    }${sort ? `&sort=${sort}` : ''}`;
  }

  _generateMarkup(doc, windowName) {}

  // static
  render(windowName, doc_arr, clear_html = true, returnHtml = false) {
    const modalList = this._parentel.querySelector(
      `.modal-window[data-window="${windowName}"] .modal-list`
    );
    if (clear_html) modalList.innerHTML = '';
    const html = doc_arr
      .map((doc) => this._generateMarkup(doc, windowName))
      .join('');

    if (returnHtml) return html;

    modalList.insertAdjacentHTML('beforeend', html);
    // if (loadSpinner) setTimeout(() => this._hideSpinner(this._parentel), 600);
    if (this._windowLoadSpinner) this._hideSpinner(this._parentel);
  }

  // show error .modal-error el
  _renderError(title, text) {
    const html = `   
    <h class="s-4" data-title>${title}</h>
    <p data-text>${text}</p>
    `;

    this._parentel.setAttribute('data-error', true);

    this._modalErrorEl.innerHTML = '';
    this._modalErrorEl.innerHTML = html;

    this._hideSpinner(this._parentel);
  }

  addItemHtmlToWindowList(windowName, item, remove_btn) {
    const window_list = this._getWindowListEl(windowName);
    const item_html = this._generateMarkup(item.dataset, remove_btn);
    window_list.insertAdjacentHTML('afterbegin', item_html);
  }

  _getActiveWindow() {
    return this._parentel.querySelector('.modal-window:not(.hidden)');
  }

  //
  click_on_content(target, handle) {}

  reset() {}

  _clickOnChangeWindowBtn(target, handle) {
    const btn =
      target.closest('.modal-tab') ||
      target.closest('button[data-window-change-btn]');
    if (!btn) return;

    const { window } = btn.dataset;

    // // active click section
    // this._windowEls.forEach((el) => {
    //   el.dataset.active = el.dataset.window === window;
    // });

    // // active click btn
    // this._windowTabs.forEach((el) => {
    //   el.dataset.active = el.dataset.window == window;
    // });

    this._switchWindow(window);
    // unactive previous section item els
    // this.reset();
  }

  _loadDocsOnScrolling(handle) {
    this._parent_containerel.addEventListener('scroll', async () => {
      // load like 12 users at a time when scrolling
      const current_sectionel = this._get_activeWindow();
      const current_section = current_sectionel.dataset.section;

      let { noMoreDocs, page, docsLoading } = current_sectionel.dataset;

      if (noMoreDocs === 'true' || docsLoading === 'true') return;
      if (
        this._parent_containerel.scrollHeight >
          this._parent_containerel.clientHeight &&
        docsLoading === 'false'
      ) {
        page = Number(page) + 1;
        current_sectionel.setAttribute('data-page', page);
        current_sectionel.setAttribute('data-docs-loading', true);

        const first_section =
          this._parentel.querySelector('.modal-section').dataset.section;

        const is_first_section = first_section === current_section;

        const docs = await handle('load-more-docs', current_sectionel.dataset);

        if (docs.length === 0)
          current_sectionel.setAttribute('data-no-more-docs', true);

        this.render(current_section, docs, is_first_section, false);

        current_sectionel.setAttribute('data-docs-loading', false);
      }
    });
  }

  _addCodeAfterDocLoad(initialLoad) {}

  _renderPagination() {}

  _setInitialWindowQueryDataAttrAndPagination(fetchTotalDocsCount) {
    const totalDocs = Number(fetchTotalDocsCount);
    const limit = Number(this._activeWindow.getAttribute('data-limit'));

    const totalPage = Math.ceil(totalDocs / limit);

    // set Load doc till page
    let lastPage = Math.ceil(
      Number(totalDocs) / Number(this._activeWindow.dataset.limit)
    );
    lastPage = lastPage === 0 ? 0 : lastPage - 1;

    if (totalDocs < limit) lastPage = 0;

    this._activeWindow.setAttribute('data-load-docs-till-page', lastPage);
    this._activeWindow.setAttribute('data-page', 0);

    if (this._pagePrevBtn) {
      this._pagePrevBtn.setAttribute('data-active', false);

      if (lastPage === 0) this._pageNextBtn.setAttribute('data-active', false);
      else this._pageNextBtn.setAttribute('data-active', true);
    }

    this._renderPagination(totalPage);
  }

  async _loadDocsAndRender(url, initialLoad = false, clearHTML = false) {
    let res;
    if (this._windowLoadSpinner) this._showSpinner(this._parentel);

    let docsRes, docsCountRes, data;
    if (initialLoad) {
      [docsRes, docsCountRes] = await Promise.all([
        get(url),
        get(this._generateUrl(true)),
      ]);

      data = [docsRes.data, docsCountRes.data];
      docsRes = docsRes.data;

      if (this._activeLoadMoreDocBtn) {
        const count = Number(docsCountRes.data.count);
        console.log(count);
        count > 5
          ? this._activeLoadMoreDocBtn.classList.remove('hidden')
          : this._activeLoadMoreDocBtn.classList.add('hidden');

        this._activeLoadMoreDocBtn.querySelector(
          '[data-value]'
        ).textContent = `(${count - Number(this._activeWindow.dataset.limit)})`;
      }

      this._activeWindow.dataset.page = 0;

      this._setInitialWindowQueryDataAttrAndPagination(data[1].count);
    } else {
      res = await get(url);
      data = res.data;
      docsRes = data;
    }

    this.render(
      this._activeWindow.dataset.window,
      docsRes.docs,
      clearHTML,
      false
    );

    this._addCodeAfterDocLoad(initialLoad, data);

    return docsRes.docs;
  }
  _addPaginationNumBtn(page, action) {
    const btnHTML = `
        <button class="btn-page"  data-page-number-btn  data-set-page="${page}"  data-active="true">
          <span>${page + 1}</span>
        </button>`;

    const sliceRange = action === 'next' ? [-1] : [0, 1];
    this._pageNumbersBtns.slice(sliceRange)[0].remove();
    // insert btn
    this._modalPageNumberBtnsContainer.insertAdjacentHTML(
      action === 'prev' ? 'afterbegin' : 'beforeend',
      btnHTML
    );
  }

  async _clickOnLoadMoreDocsBtn(target) {
    if (!target.closest('.modal-load-doc-btn')) return;

    let {
      url,
      docsLeft,
      page,
      totalDocs,
      loadDocsTillPage,
      limit,
      redirectDocsPageUrl,
    } = this._activeWindow.dataset;

    page = Number(page) + 1;
    loadDocsTillPage = Number(loadDocsTillPage);
    docsLeft = this.boolean_converter(docsLeft);
    totalDocs = Number(totalDocs);
    limit = Number(limit);

    console.log(totalDocs, page * limit);

    // when max docs loaded in cur page, then we show all docs in new page
    if (page === loadDocsTillPage) {
      this._activeWindow.dataset.docsLeft = false;
      this._activeLoadMoreDocBtn.classList.add('hidden');

      if (redirectDocsPageUrl) return location.assign(redirectDocsPageUrl);
    }

    if (docsLeft) {
      this._activeWindow.dataset.page = page;

      if (this._activeLoadMoreDocBtn)
        this._activeLoadMoreDocBtn.querySelector(
          '[data-value]'
        ).textContent = `(${totalDocs - (page + 1) * limit})`;
      // render

      this._loadDocsAndRender(this._generateUrl(), false);
    }

    // const
  }

  async _clickOnPaginationBtns(target, clearHTML = false) {
    if (!target.closest('.btn-page')) return;

    const clickedBtn = target.closest('.btn-page');
    const { action, active } = clickedBtn.dataset;
    if (active === 'false' && !clickedBtn.hasAttribute('data-page-number-btn'))
      return;

    const btnsContainer = target.closest('.modal-page-btns');
    const nextBtn = btnsContainer.querySelector('button[data-action="next"]');
    const prevBtn = btnsContainer.querySelector('button[data-action="prev"]');

    let page = Number(this._activeWindow.dataset.page);
    let loadDocsTillPage = Number(this._activeWindow.dataset.loadDocsTillPage);

    if (clickedBtn.hasAttribute('data-page-number-btn')) {
      page = Number(clickedBtn.dataset.setPage);

      if (page === 0) {
        prevBtn.setAttribute('data-active', false);
        nextBtn.setAttribute('data-active', true);
      } else if (page + 1 === loadDocsTillPage)
        nextBtn.setAttribute('data-active', false);
      else {
        prevBtn.setAttribute('data-active', true);
        nextBtn.setAttribute('data-active', true);
      }

      this._activeel_in_arr(clickedBtn, this._pageNumbersBtns);
    }

    if (action === 'prev') {
      page = page - 1;

      if (page === 0) {
        this._activeWindow.setAttribute('data-page', 0);
        prevBtn.setAttribute('data-active', false);
      }

      if (page + 1 === loadDocsTillPage)
        nextBtn.setAttribute('data-active', true);
    }
    if (action === 'next') {
      page = page + 1;
      if (page === loadDocsTillPage) {
        nextBtn.setAttribute('data-active', false);
      }
      if (page > 0) prevBtn.setAttribute('data-active', true);
    }

    this._activeWindow.setAttribute('data-page', page);

    // if page number btn exist then active it
    if (this._pageNumbersBtns && (action === 'next' || action === 'prev')) {
      this._activeel_in_arr(
        this._pageNumbersBtns.find((el) => Number(el.dataset.setPage) === page),
        this._pageNumbersBtns
      );
    }

    this._parentel.scrollIntoView();
    console.log(this._generateUrl());
    this._loadDocsAndRender(this._generateUrl(), false, true);
  }

  _set_unchanged_DOM_els() {
    this._parentElHasChildPositionEl =
      this._parentel.getAttribute('data-has-child-positionel') === 'true';

    this._parent_containerel = this._parentel.querySelector('.modal-container');
    // no of sections

    this._windowEls = [...this._parentel.querySelectorAll('.modal-window')];

    this._windowTabs = [...this._parentel.querySelectorAll('.modal-tab')];

    this._windowLoadSpinner = this.boolean_converter(
      this._parentel.getAttribute('data-load-spinner')
    );

    this._modalErrorEl = this._parentel.querySelector('.modal-error');

    this._activeWindow = this._parentel.querySelector(
      '.modal-window[data-active="true"]'
    );
    // current display section
    if (this._activeWindow) {
      this._activeModalList = this._activeWindow.querySelector('.modal-list');
      this._activeLoadMoreDocBtn = this._activeWindow.querySelector(
        '.modal-load-doc-btn '
      );

      this._pagePrevBtn = this._activeWindow.querySelector(
        '.btn-page[data-action="prev"]'
      );
      this._pageNextBtn = this._activeWindow.querySelector(
        '.btn-page[data-action="next"]'
      );
      // const { url, docsLeft, page, limit } = this._activeWindow.dataset;
      // this._url = url;
      // this._docsLeft = this.boolean_converter(docsLeft);
      // this._page = Number(page);
      // this._limit = Number(limit);
    }

    this._pageBtnsContainer = this._parentel.querySelector('.modal-page-btns');
  }

  _set_changed_DOM_els(target) {
    // current display section
    this._activeWindow = this._parentel.querySelector(
      '.modal-window[data-active="true"]'
    );

    if (this._activeWindow) {
      this._pagePrevBtn = this._activeWindow.querySelector(
        '.btn-page[data-action="prev"]'
      );
      this._pageNextBtn = this._activeWindow.querySelector(
        '.btn-page[data-action="next"]'
      );

      this._pageNumbersBtns = [
        ...this._activeWindow.querySelectorAll('[data-page-number-btn]'),
      ];

      // const { url, docsLeft, page, limit } = this._activeWindow.dataset;
      // this._url = url;
      // this._docsLeft = this.boolean_converter(docsLeft);
      // this._page = Number(page);
      // this._limit = Number(limit);

      this._activeLoadMoreDocBtn = this._activeWindow.querySelector(
        '.modal-load-doc-btn '
      );

      this._activeModalList = this._activeWindow.querySelector('.modal-list');
    }
  }

  _hideChildPositionElWhenNotInteracting(target) {
    console.log('positionel-hide');
    // hide childpositionel inside parentpositionel when hover or clicked outside the childPositionEl
    if (this._parentElHasChildPositionEl) {
      console.log('done');
      const isInteractingWithChildPositionEl = target.closest(
        '.positionel[data-child-positionel="true"]'
      );
      if (!isInteractingWithChildPositionEl) {
        return this.hide(
          'true',
          this._parentel.querySelector(
            '.positionel[data-child-positionel="true"]'
          )
        );
      }
    }
  }

  // handle absolute-modal-el (out of flow)
  _handle_el(target, handle) {
    // common el selected by parent

    // modal type
    // - window
    // -normal

    // If modal type is window
    if (
      this._parentel.getAttribute('data-modal-type') === 'window' ||
      this._parentel.getAttribute('data-modal-type') === 'gallery'
    ) {
      this._set_changed_DOM_els(target);
      // change window
      this._clickOnChangeWindowBtn(target, handle);

      // single window modal
      this._clickOnLoadMoreDocsBtn(target);

      // pagination btn
      this._clickOnPaginationBtns(target);
    }

    this._hideChildPositionElWhenNotInteracting(target);

    this.click_on_content(target, handle);
  }

  _additional_funcs() {
    if (
      this._parentel.getAttribute('data-modal-type') === 'window' ||
      this._parentel.getAttribute('data-modal-type') === 'gallery'
    )
      this._set_unchanged_DOM_els();
  }
}

export default ModalView;
