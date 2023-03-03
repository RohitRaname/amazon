import { get } from '../../../../Controller/api/api.js';
import ModalView from '../../../Common/PositionComponent/ModalView.js';
import { RatingIconsHtml } from '../../../Common/ratingIcons.js';

export default class ProductMenuItemsModalView extends ModalView {
  _parentel = document.querySelector('.productMenu-items-modal');

  // product Page Summary
  _productMenuPageSummaryEl = document.querySelector('.productMenu-summary');
  _productMenuPageDocsRange =
    this._productMenuPageSummaryEl.querySelector('[data-docs-range]');
  _productMenuPageTotalDocs =
    this._productMenuPageSummaryEl.querySelector('[data-total-docs]');
  _productMenuPageSearchWord =
    this._productMenuPageSummaryEl.querySelector('[data-search-word]');
  _productMenuSummaryHeaderEl = document.querySelector('.productMenu-header');

  _modalPageNumberBtnsContainer = this._parentel.querySelector(
    '.modal-page-numbers-btns'
  );

  _generateMarkup(doc) {
    const {
      convertPrice,
      price,
      rating,
      thumbnail,
      title,
      url,
      color,
      variantByColors,
      _id,
    } = doc;

    const finalPrice = convertPrice ? convertPrice : price;

    return `<div class="productMenu-item f-lw">
    <!-- thumbnail -->
    <div class="productMenu-item-img-box img-box-hg">
      <img src="${thumbnail}" alt="">
    </div>

    <div class="productMenu-item-details mg-lw-all">
      <h class="s-6 s-l">${title}</h>

      <!-- ratings and count -->
      <div class="productMenu-item-rating-stats f-sl f-ab">
        <div class="f product-rating-icons">
          ${RatingIconsHtml(rating.value)}
        </div>
        <i class="fa fa-angle-down dim icon-lw" aria-hidden="true"></i>
        <a href="/product/page/#section-review" class="btn-inline">${
          rating.value
        }</a>
      </div>

      <!-- price -->
      <div class="productMenu-item-price">
        <!-- price -->
        <div class="f-sm">
          <span class="product-price-discount h-4 h-0 w-300 primary trans-sl">0%</span>
          <p class="product-price-current f f-as">
            <span> ${finalPrice.unit} </span>
            <span class="h-4 h-m h-0 trans-sl inline">${finalPrice.value}</span>
          </p>
        </div>
      </div>

      <div class="productMenu-item-more-details mg-sm-all">
        <p class="t-md mg-lw">Save extra with No Cost EMI</p>
        <p class="">FREE Delievery by Amazon</p>

        <!-- color-variant -->
        <div class="productMenu-item-variants f-sm">
        ${variantByColors
          .map(
            (variant, i) =>
              `<a class="productMenu-item-variant-color"  href="/${title
                .split(' ')
                .join('-')}/${variant.variant_id}" style="background-color:${
                variant.color
              }" data-active="${variant.color === color}">
              <img src="${
                variant.color_img
              }" style="height:100%;width:100%;"></img>
            </a>
            `
          )
          .join('')}
        </div>
      </div>
    </div>
  </div>`;
  }

  _addCodeAfterDocLoad(initialLoad, data) {
    const { summary } = data;

    // updating the page summary (docs-range,totalDocs,searchWord)
    this._productMenuPageDocsRange.textContent = summary.docsRange;
    this._productMenuPageTotalDocs.textContent = summary.count;
    this._productMenuPageSearchWord.textContent = `"${summary.searchWord}"`;

    // scrolling page to top
    // document.documentElement.scrollHeight = 0;
  }

  _generatePageNumberBtnMarkup(curPage, pageArr, totalPage) {
    const html = pageArr
      .map((page) => {
        return `
        <button class="btn-page ${
          page === 'spread' ? 'no-click f f-ac' : ''
        }"  data-page-number-btn  data-set-page="${page}"   data-active="${
          page + 1 === 1
        }">
          <span>${page === 'spread' ? `` : page + 1}</span>
          ${page === 'spread' ? `<i class="fas fa-ellipsis-h"></i>` : ``}

        </button>`;
      })
      .join('');
    return html;
  }

  _renderPagination(totalPage) {
    if (totalPage === 0) return this._pageBtnsContainer.classList.add('hidden');
    else this._pageBtnsContainer.classList.remove('hidden');

    totalPage = Number(totalPage) + 1;
    let pageArr;

    // if (totalPage === 0) pageArr = [0];
    // else if (totalPage === 1) pageArr = [0];
    // else if (totalPage === 2) pageArr = [0, 1];
    // else if (totalPage === 3) pageArr = [0, 1, 2];
    // else pageArr = [0, 1, 2, 'spread', totalPage];

    pageArr = new Array(totalPage).fill('*').map((el, i) => i);

    const pageNumberBtnMarkup = this._generatePageNumberBtnMarkup(
      0,
      pageArr,
      totalPage
    );
    this._modalPageNumberBtnsContainer.innerHTML = pageNumberBtnMarkup;

    if (totalPage === 0) this._pagePrevBtn.setAttribute('data-active', false);
    if (totalPage > 2) this._pageNextBtn.setAttribute('data-active', true);
  }

  // render filter docs in ProductMenu window and update product summary
  async renderFilterDocs(queryObj) {
    this._parentel.setAttribute('data-error', false);

    this._showSpinner(this._parentel);
    const { set, queryStr, type } = queryObj;

    console.log(queryObj);

    if (type === 'sort') this._updateModalSortQuery(queryObj);
    else {
      // add or remove filter parameter from window filter query
      set
        ? this._updateModalFilterQuery(queryStr)
        : this._removeParameterFromFilterQuery(queryStr);
    }

    const res = await get(this._generateUrl());

    const { docs, summary } = res.data;

    // if not results
    if (!docs || docs.length === 0) {
      this._renderError('No results found.', 'Please try with another filter');
      this._productMenuSummaryHeaderEl.classList.add('hidden');
      return;
    } else {
      this._productMenuSummaryHeaderEl.classList.remove('hidden');
    }

    this._addCodeAfterDocLoad(true, res.data);
    this.render(this._activeWindow.dataset.window, docs, true, false);
    this._setInitialWindowQueryDataAttrAndPagination(summary.count);
  }

  async click_on_content(target, handle) {}
}
