import { get } from '../../../Controller/api/api.js';
import { RatingIconsHtml } from '../../Common/ratingIcons.js';

export default class rowColumnView {
  _parentEl = document.querySelector('body');
  _dynamicLoadDataRows = [
    ...document.querySelectorAll('.row[data-row-type="dynamic-load"]'),
  ];
  _staticScrollableRows = [
    ...document.querySelectorAll(
      '.row[data-row-type="static"][data-row-scroll="true"]'
    ),
  ];

  _rowSpinnerEls = [...document.querySelectorAll('.row-spinner')];

  constructor() {
    this._reevalualteRowLimitAndTotalPageNeedToBeLoaded();
    this._loadFirstSetOfRowsDocsWhenReachedItsPosition();
    this._mouseEventOnStaticRowsWithBigImgs();
  }

  _getMaxRowItems(rowItemMinWidth) {
    return Math.floor(
      (document.documentElement.clientWidth - 166) / rowItemMinWidth
    );
  }

  _getDynamicRowItemWidth(rowItemMinWidth) {
    const maxRowItems = this._getMaxRowItems(rowItemMinWidth);

    return (document.documentElement.clientWidth - 166) / maxRowItems;
  }

  //  row-limit & row-max-page updated according to user screen
  _reevalualteRowLimitAndTotalPageNeedToBeLoaded(rowItemMinWidth) {
    this._dynamicLoadDataRows.forEach((el) => {
      let { limit, rowItemMinWidth, totalDocsLoad } = el.dataset;
      rowItemMinWidth = Number(rowItemMinWidth);
      const maxRowItemsExist = this._getMaxRowItems(rowItemMinWidth);
      limit = Number(limit);
      totalDocsLoad = Number(totalDocsLoad);

      const totalPage = Math.ceil(
        Number(el.getAttribute('data-total-docs-load')) / maxRowItemsExist
      );
      el.setAttribute('data-load-docs-till-page', totalPage);
      el.querySelector('.row-last-page').textContent = totalPage;
      el.setAttribute(
        'data-max-docs-limit-acc-to-user-device',
        maxRowItemsExist
      );

      // if (Number(limit) > maxRowItemsExist)
      //   el.setAttribute('data-limit', maxRowItemsExist);
    });
  }

  _renderEmptyItems(rowContentEl, arr, rowItemWidth) {
    const html = arr
      .map((el) => {
        const docHTML = `   
              <div class="col" data-show-spinner="true" data-hide="true" style="width:${rowItemWidth}px">
                      <div class="col-content">
                      
                    </div>
              </div>`;

        return docHTML;
      })
      .join('');

    rowContentEl.insertAdjacentHTML('beforeend', html);
  }

  // delay show effect
  _showItemsWithDelayEffect(rowContent, direction, page, limit) {
    // hiding prev col-items to show transition effect
    const items = [...rowContent.querySelectorAll('.col')]
      .slice(page * limit, (page + 1) * limit)
      .reverse();

    // hide all items
    items.forEach((el) => {
      el.setAttribute('data-show-spinner', false);
      el.setAttribute('data-hide', true);
    });

    // show with delay right to left

    items.forEach((el, i) => {
      setTimeout(() => {
        el.setAttribute('data-hide', false);
      }, i * 46);
    });
  }

  // i need to
  _updateEmptyItems(
    rowItemType,
    rowContentEl,
    page,
    initialLoadLimit,
    limit,
    docs
  ) {
    console.log(
      page * limit,
      initialLoadLimit ? initialLoadLimit : (page + 1) * limit,
      docs
    );
    const colItems = [...rowContentEl.querySelectorAll('.col')]
      .slice(
        page * limit,
        initialLoadLimit ? initialLoadLimit : (page + 1) * limit
      )
      .reverse();

    docs.forEach((doc, i) => {
      const { _id, title, thumbnail, rating, price, convertPrice } = doc;

      const finalPrice = convertPrice ? convertPrice : price;

      let docHTML;

      if (rowItemType === 'suggested-item')
        docHTML = `   
        <a href="/products/${_id}" class="col-content">
                        <div class="img-box-md">
                        <img src="${thumbnail}" alt="${title}" />
                        </div>
                        <p class="col-title t-sm blue capitalize hover-color-primary">
                        ${title}
                        </p>
                        <div class="f-lw f-ac mg-b-sl">
                        <div class="product-rating-icons f f-ab">
                        ${RatingIconsHtml(rating.value, 'icon-sm')}
                          </div>
                          <p class="t-sm hover-color-primary">${
                            rating.count
                          }</p>
                          </div>
                          <div class="card-price f-0 f-as">
                          <p class="pt-sl">${finalPrice.unit}</p>
                          <span class="pt move-word-up">${
                            finalPrice.value
                          }</span>
                                    </div>
                                    </a>
                                    `;
      else if (rowItemType === 'item-with-sm-img')
        docHTML = `
                                    <a href="/products/${_id}" class="col-content">
                                    <div class="img-box-sm">
                                    <img src="${thumbnail}" alt="${title}" />
                                    </div>
                                    </a>`;

      colItems[i].innerHTML = docHTML;
    });

    colItems.forEach((el, i) => {
      setTimeout(() => {
        el.setAttribute('data-show-spinner', false);
        el.setAttribute('data-hide', false);
      }, i * 30);
    });
  }

  async _loadItems(rowEl, initialLoadObj, nextSetPageNo) {
    let {
      rowItemType,
      url,
      page,
      limit,
      sort,
      maxDocsLimitAccToUserDevice,
      totalDocsLoad,
      rowItemMinWidth,
    } = rowEl.dataset;
    page = page === '' ? 0 : Number(page);
    limit = Number(limit);

    maxDocsLimitAccToUserDevice = Number(maxDocsLimitAccToUserDevice);
    rowItemMinWidth = Number(rowItemMinWidth);
    totalDocsLoad = Number(totalDocsLoad);

    const rowContentEl = rowEl.querySelector('.row-content');

    // loading new docs
    const rowItemWidth = this._getDynamicRowItemWidth(rowItemMinWidth);

    // if items are only to conver first page
    if (totalDocsLoad < maxDocsLimitAccToUserDevice) {
      this._renderEmptyItems(
        rowContentEl,
        new Array(totalDocsLoad).fill('*'),
        rowItemWidth
      );

      const res = await get(
        `${url}?limit=${totalDocsLoad}&page=${0}${sort ? `&sort=${sort}` : ''}`
      );
      const { docs } = res.data;

      this._updateEmptyItems(
        rowItemType,
        rowContentEl,
        page,
        false,
        maxDocsLimitAccToUserDevice,
        docs
      );

      return;
    }

    let docsToLoad;
    if (initialLoadObj) {
      const { noOfTimesLoadDocs } = initialLoadObj;
      docsToLoad =
        Number(noOfTimesLoadDocs) === 0
          ? limit
          : maxDocsLimitAccToUserDevice - limit;
    } else {
      docsToLoad =
        limit > maxDocsLimitAccToUserDevice
          ? limit
          : maxDocsLimitAccToUserDevice;
    }

    this._renderEmptyItems(
      rowContentEl,
      new Array(docsToLoad).fill('*'),
      rowItemWidth
    );

    const res = await get(
      `${url}?limit=${docsToLoad}&page=${nextSetPageNo ? nextSetPageNo : page}${
        sort ? `&sort=${sort}` : ''
      }`
    );
    const { docs } = res.data;

    this._updateEmptyItems(
      rowItemType,
      rowContentEl,
      initialLoadObj
        ? page + Number(initialLoadObj.noOfTimesLoadDocs)
        : nextSetPageNo
        ? Number(nextSetPageNo)
        : page,
      initialLoadObj && Number(initialLoadObj.noOfTimesLoadDocs) === 1
        ? maxDocsLimitAccToUserDevice
        : false,
      initialLoadObj && Number(initialLoadObj.noOfTimesLoadDocs) === 1
        ? limit
        : limit > maxDocsLimitAccToUserDevice
        ? limit
        : maxDocsLimitAccToUserDevice,
      docs
    );

    // updating pageLoaded attr

    // rowEl.setAttribute(
    //   'data-docs-loaded',
    //   Number(rowEl.getAttribute('data-docs-loaded')) + limit
    // );
  }

  handleRows() {
    this._parentEl.addEventListener('click', async (e) => {
      const target = e.target;

      const rowBtn = target.closest('.row-btn-box button');
      if (!rowBtn) return;
      const { direction } = rowBtn.dataset;

      const rowEl = target.closest('.row');
      const rowContentEl = rowEl.querySelector('.row-content');
      const rowPageSpanEl = rowEl.querySelector('.row-page [data-value]');

      // ROW ARE OF TWO TYPE
      // 1.DOCS LOAD(dynamic-load-row)
      // 2.DATA ALREADY EXIST (static-row) (NO NEED TO LOAD DATA FROM THE BEGINNING)
      let { rowType, page, loadDocsTillPage } = rowEl.dataset;
      page = Number(page);
      loadDocsTillPage = Number(loadDocsTillPage);

      // static-row
      if (rowType === 'static') {
        const leftBtn = rowEl.querySelector('button[data-direction="left"]');
        const rightBtn = rowEl.querySelector('button[data-direction="right"]');

        // take care of opacity of button

        rowBtn.dataset.focus = true;

        if (direction === 'right') {
          page = page + 1;

          if (page + 1 === loadDocsTillPage) {
            leftBtn.dataset.active = true;
            rightBtn.dataset.active = false;
          }
          if (page === loadDocsTillPage) {
            return;
          }

          if (
            page !== 0 &&
            page + 1 !== loadDocsTillPage &&
            page !== loadDocsTillPage
          ) {
            leftBtn.dataset.active = true;
            rightBtn.dataset.active = true;
          }

          rowContentEl.style.transform = `translateX(${-page * 100}%)`;
          rowEl.setAttribute('data-page', page);
        } else {
          if (page === 0) {
            leftBtn.dataset.active = false;
            rightBtn.dataset.active = true;
            return;
          }
          page = page - 1;
          if (page === 0) {
            leftBtn.dataset.active = false;
            rightBtn.dataset.active = true;
          }

          rowContentEl.style.transform = `translateX(${-page * 100}%)`;
          rowEl.setAttribute('data-page', page);
        }

        return;
      }

      // Dynamic-row
      let { pageLoaded, limit, totalDocsLoad, maxDocsLimitAccToUserDevice } =
        rowEl.dataset;
      maxDocsLimitAccToUserDevice = Number(maxDocsLimitAccToUserDevice);
      limit = Number(limit);
      totalDocsLoad = Number(totalDocsLoad);

      const pageLoadedArr = pageLoaded.split(',').map((el) => Number(el));

      if (direction === 'right') {
        // all page loaded

        page = page + 1;
        rowPageSpanEl.textContent = page + 1;
        if (page === loadDocsTillPage) {
          rowEl.setAttribute('data-page', 0);
          rowPageSpanEl.textContent = 1;
          rowContentEl.style.transform = `translateX(0%)`;
          this._showItemsWithDelayEffect(
            rowContentEl,
            'right',
            page,
            maxDocsLimitAccToUserDevice
          );
          return;
        }

        // if page already loaded
        rowContentEl.style.transform = `translateX(${-page * 100}%)`;
        this._showItemsWithDelayEffect(
          rowContentEl,
          'right',
          page,
          limit > maxDocsLimitAccToUserDevice
            ? limit
            : maxDocsLimitAccToUserDevice
        );
        rowEl.setAttribute('data-page', page);

        if (pageLoadedArr.find((el) => el === page)) {
          return;
        }

        pageLoadedArr.push(page);
        rowEl.setAttribute('data-page-loaded', pageLoadedArr.join(','));

        if (page === 1) {
          await this._loadItems(rowEl);
          await this._loadItems(rowEl, false, page + 1);
        } else {
          if (page < loadDocsTillPage - 1)
            await this._loadItems(rowEl, false, page + 1);
        }

        return;
      }

      if (direction === 'left') {
        if (page === 0) return;
        page = page - 1;
        rowPageSpanEl.textContent = page;
        rowEl.setAttribute('data-page', page);

        this._showItemsWithDelayEffect(
          rowContentEl,
          'left',
          page,
          limit > maxDocsLimitAccToUserDevice
            ? limit
            : maxDocsLimitAccToUserDevice
        );

        rowContentEl.style.transform = `translateX(${-page * 100}%)`;

        return;
      }
    });
  }
  _handleIntersectResponse(entries, observer) {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.classList.contains('row-spinner')){
          if(el.getAttribute('data-hide-manual')==="true") return;
          setTimeout(() => el.setAttribute('data-show-spinner', false), 1000);
        }

        if (el.classList.contains('row')) {
          const rowEl = el;
          if (rowEl && rowEl.getAttribute('data-initial-docs-load') === 'true')
            return;

          let { limit, maxDocsLimitAccToUserDevice, page, pageLoaded, url } =
            rowEl.dataset;

          const pageLoadedArr = pageLoaded.split(',').map((el) => Number(el));
          page = Number(page);
          rowEl.setAttribute('data-initial-docs-load', true);

          pageLoadedArr.push(page);
          rowEl.setAttribute('data-page-loaded', pageLoadedArr.join(','));

          limit = Number(limit);
          maxDocsLimitAccToUserDevice = Number(maxDocsLimitAccToUserDevice);
          rowEl.setAttribute('data-page', 0);

          let i = 0;

          // check totalDocs and if we have docs then load
          const res = await get(`${url}/count`);
          const totalDocsCount = Number(res.data.count);

          console.log(totalDocsCount)
          if (totalDocsCount === 0) {
            rowEl.classList.add('hidden');
            return;
          }

          const maxRowItemsExist = this._getMaxRowItems(
            rowEl.dataset.rowItemMinWidth
          );
          const totalPage = Math.ceil(totalDocsCount / maxRowItemsExist);
          el.querySelector('.row-last-page').textContent = totalPage;
          rowEl.setAttribute('data-load-docs-till-page', totalPage);
          rowEl.setAttribute('data-total-docs-load', totalDocsCount);

          if (totalPage === 1) return this._loadItems(rowEl);
          for await (const load of new Array(
            Math.ceil(maxDocsLimitAccToUserDevice / limit) || 1
          ).fill('*')) {
            await this._loadItems(rowEl, { noOfTimesLoadDocs: i });
            i = i + 1;
          }
        }

        observer.unobserve(entry.target);
      }
    });
  }
  //  load first set of items when reach to row
  _loadFirstSetOfRowsDocsWhenReachedItsPosition() {
    let observer;

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: '0',
    };

    observer = new IntersectionObserver(
      this._handleIntersectResponse.bind(this),
      options
    );

    [...this._dynamicLoadDataRows, ...this._rowSpinnerEls].forEach((el) =>
      observer.observe(el)
    );
  }

  _mouseEventOnStaticRowsWithBigImgs() {
    this._staticScrollableRows.length > 0 &&
      this._staticScrollableRows.forEach((rowEl) => {
        const btns = [...rowEl.querySelectorAll('button')];
        rowEl
          .querySelector('.row-content')
          .addEventListener('mouseleave', function () {
            setTimeout(() => {
              btns.forEach((btn) => (btn.dataset.focus = false));
            }, 1000);
          });
      });
  }
}
