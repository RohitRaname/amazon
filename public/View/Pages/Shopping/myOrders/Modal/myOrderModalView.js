import { get } from '../../../../../Controller/api/api.js';
import ModalView from '../../../../Common/PositionComponent/ModalView.js';

export default class MyOrderModalView extends ModalView {
  _parentel = document.querySelector('.myOrder-modal');
  _totalOrderCountByTimeFrameSelect = this._parentel.querySelector(
    '[data-orders-count-by-timeframe]'
  );

  _generateMarkup(doc, windowName) {
    if (windowName === 'myOrders') {
      const { item, summary } = doc;
      return `<div class="item r-md border-light">
    <header class="item-header f-bg bg-dark p-lw">
      <div>
        <p class="uppercase t-sm">Order placed</p>
        <p>${this._date(doc.ts)}</p>
      </div>
      <div>
        <p class="uppercase t-sm">Total</p>
        <p>${this._userCurrencySymbol}${(
       item.price * this._userCurrencyRate
      ).toFixed(2)}</p>
      </div>
      <div>
        <p class="uppercase t-sm">ship to</p>
        <p
          class="f-sl f-ab"
          data-positionel-name="shipping-address-in-detail"
          data-positionel-btn=""
          data-data='{"address":"${summary.shipping.name} ${
        summary.shipping.address
      }"}'
        >
          <span class="blue shipping-address">${summary.shipping.name}</span
          ><i class="fa fa-angle-down icon-lw light" aria-hidden="true"></i>
        </p>
      </div>
    </header>
    <div class="item-content p-sm">
      <div class="f-lw">
        <img
          class="img-sm trans-sl"
          src="${item.thumbnail}"
          alt=""
        />
        <div>
          <a
            class="blue hover-primary"
            href="${this._setProductUrl(item.title, item._id)}"
            >${item.title}</a
          >
        </div>
      </div>
    </div>
  </div>
           `;
    }

    if (windowName === 'buy-again') {
      const { _id, thumbnail, title, price } = doc;

      return `<div class="grid-item"
                >
                <img
                  class="img-bg trans-lw"
                  src="${thumbnail}"
                  alt="Apple iPhone 14 256 GB midnight"
                />
                  <div class="trans-sm mg-sl-all left">
                      <a href="${this._setProductUrl(title, _id)}"  class="pt-md hover-color-primary">${title}</a>
                      <p class="mg-sl">
                        <span class="inline pt-lw trans-sl">${
                          this._userCurrencySymbol
                        }</span
                        ><span class="pt-bg">${this._convertProductPrice(
                          price
                        )}</span>
                      </p>
                      <div class="order-added-to-cart-message f-lw f-js mg-lw hide">
                        <button class="btn-icon round btn-icon-sl bg-green">
                          <i class="fas fa-check icon-sl white" aria-hidden="true"></i>
                          </button>
                          <h class="pt-sm">Added to cart</h>
                      </div>
                      <button
                        class="btn-primary r-round f-size-sm btn-100 btn-md"
                        data-action="add-to-cart"
                        data-data=${JSON.stringify({_id:_id,qty:1})}
                        data-click-effect=""
                        data-automatic
                        data-checkout-func="false"
                      >
                        Add to Cart
                      </button>
                  </div>
                  </div>
              `;
    }
  }

  _addCodeAfterDocLoad(initialLoad, data) {
    if (initialLoad) {
      if (this._activeWindow.dataset.window === 'myOrders') {
        const [docsRes, docsCountRes] = data;
        const docsCount = docsCountRes.count;
        this._totalOrderCountByTimeFrameSelect.textContent = `${docsCount} order`;
      }
    }
  }

  async renderFilterOrdersByDate(queryObj) {
    const { queryString } = queryObj;

    this._activeWindow.setAttribute('data-filter-query', queryString);
    this._loadDocsAndRender(this._generateUrl(), true);
  }

  async click_on_content(target, handle) {}
}
