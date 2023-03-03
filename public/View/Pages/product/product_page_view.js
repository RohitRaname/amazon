import { activeel } from '../../utils/domHelper.js';
import { post, get,patch } from '../../../Controller/api/api.js';
import PageView from '../../Common/pageView.js';

export default class ProductPageView extends PageView {
  _pageEl = document.querySelector('body[data-page="product"]');
  _parentel = document.querySelector('.section-product');

  // SECTION_HERO
  _product_preview_imgs_container =
    this._parentel.querySelector('.product-imgs');
  _product_preview_imgs = [
    ...this._parentel.querySelectorAll('.product-img-box'),
  ];
  _cur_product_imgel = this._parentel.querySelector('.product-cur-img-box img');
  _productQtySelect = this._parentel.querySelector('.product-qty-selected');

  // CTA
  _addToCart = document.querySelector('.addToCart');
  _addToCartItemCountSpanEls = this._addToCart && [
    ...this._addToCart.querySelectorAll('[data-item-count]'),
  ];
  _addToCartPriceSpanEl =
    this._addToCart && this._addToCart.querySelector('[data-item-price]');

  // SECTION_Q&A
  _product_general_ques_and_ans_container = this._parentel.querySelector(
    '.product-ques-ans .modal-content'
  );
  _search_QAndA_or_reviews_related_to_product_input =
    this._parentel.querySelector(
      '[name="search-asked-questions-or-reviews-related-to-product"]'
    );

  _product_search_matching_quesans_and_reviews_container =
    this._parentel.querySelector(
      '.product-search-matching-ques-ans-and-reviews-modal'
    );

  // SECTION_REVIEW
  _ratingsChartContainer = this._parentel.querySelector(
    '.product-ratings-overview'
  );

  ///////////////////////////////////////
  // HERO_SECTION
  ///////////////////////////////////////
  // change product-img when hover on product-previow-imgs
  _change_cur_img_when_preview_img_hovered() {
    this._product_preview_imgs_container.addEventListener('mouseover', (e) => {
      const cur_img_hover = e.target.closest('.product-img-box img');
      if (!cur_img_hover) return;
      console.log(cur_img_hover, this._cur_product_imgel);
      this._cur_product_imgel.src = cur_img_hover.src;
    });
  }

  _click_on_product_cur_img(target, handle) {
    const cur_imgbox = target.closest('.product-cur-img-box');
    if (cur_imgbox)
      handle('set-click-product-img-and-show-product-overview-imgs-modal', {
        src: cur_imgbox.querySelector('img').src,
      });
  }

  _click_on_product_variants_options(target) {
    if (
      !target.closest('.box') ||
      !target.closest('[data-product-variant-options]')
    )
      return;

    const product_variants = [
      ...target
        .closest('[data-product-variant-options]')
        .querySelectorAll('.box'),
    ];
    const product_variant_clicked = target.closest('.box');
    activeel(product_variants, product_variant_clicked);
  }
  _click_on_product_preview_imgs(target) {
    const preview_img_box = target.closest('.product-img-box');
    if (preview_img_box) activeel(this._product_preview_imgs, preview_img_box);
  }

  async _addToCartBtn(target) {
    const addToCartBtn = target.closest('button[data-action="add-to-cart"]');
    if (!addToCartBtn) return;

    const data = JSON.parse(addToCartBtn.dataset.data);

    data.qty = Number(this._productQtySelect.textContent);

    console.log('qty', data.qty);
    await post('users/me/cart', data);

    const cartSummaryRes = await get('users/me/cart/summary');
    const cartSummary = cartSummaryRes.data;

    // set total cart-items count and amount in addToCart
    this._addToCartItemCountSpanEls.forEach(
      (el) => (el.textContent = cartSummary.count)
    );
    this._addToCartPriceSpanEl.textContent = cartSummary.amount;

    // hide spinner
    this._addToCart.querySelector(
      '.addToCart-container'
    ).dataset.showSpinner = false;
  }
  async _buyBtn(target) {
    const buyBtn = target.closest('button[data-action="buy-now"]');
    if (!buyBtn) return;

    const data = JSON.parse(buyBtn.dataset.data);

    await post('users/me/shopping/cart/checkout', { items: [data] });
    location.assign('/me/checkout');
  }

  async _checkoutAllItems(target) {
    const checkoutAllItemsBtn = target.closest(
      'button[data-action="checkout-all-items"]'
    );
    if (!checkoutAllItemsBtn) return;

    await post('users/me/shopping/cart/checkout');
    location.assign('/me/checkout');
  }

  _handle_hero_section(target, handle) {
    if (!target.closest('.product-hero')) return;
    this._click_on_product_cur_img(target, handle);

    // side preview images
    this._click_on_product_preview_imgs(target, handle);

    // variants options
    this._click_on_product_variants_options(target);

    if (this._userProfile) {
      this._addToCartBtn(target);
      this._buyBtn(target);
    }
  }
  /////////////////////////////////////////////////////////
  // CUSTOMER_REVIEWS_SECTION
  /////////////////////////////////////////////////////////

 async  _handle_customer_reviews_section(target, handle) {
    if (!target.closest('.product-customer-reviews')) return;

    if (target.closest('.review-img'))
      handle(
        'show-clicked-review-overview-in-modal',
        target.closest('.review')
      );

    if (target.closest('.review-helpful-btn') && this._userProfile) {
      const btn = target.closest('.review-helpful-btn');
      const res=  await patch(btn.dataset.url,{},false,true);
      if(res.message==="item-exist") return;    
      const helpfulBtnContainer = btn.closest('.review-helpful-box');

      const helpfulCountEl = helpfulBtnContainer.querySelector('[data-value]');

      helpfulCountEl.textContent = Number(helpfulCountEl.textContent) + 1;

    }
  }

  handle_parentel(handle) {
    this._pageEl.addEventListener('click', (e) => {
      const target = e.target;

      this._handle_hero_section(target, handle);
      this._handle_customer_reviews_section(target, handle);

      this._checkoutAllItems(target);
    });

    // search query to happen after particular time (delay)
    let searchQueryExecute;

    // search ques-ans and reviews
    this._search_QAndA_or_reviews_related_to_product_input.addEventListener(
      'input',
      () => {
        const query =
          this._search_QAndA_or_reviews_related_to_product_input.value;

        if (query === '') {
          this._product_general_ques_and_ans_container?.classList.remove(
            'hidden'
          );
          this._product_search_matching_quesans_and_reviews_container.classList.add(
            'hidden'
          );

          return;
        }

        if (searchQueryExecute) {
          clearTimeout(searchQueryExecute);
        }

        searchQueryExecute = setTimeout(async () => {
          // const data= await handle('reviews-and-q&a-related-to-search-word',query)
          this._product_general_ques_and_ans_container?.classList.add('hidden');
          this._product_search_matching_quesans_and_reviews_container.classList.remove(
            'hidden'
          );

          // render the docs
          handle('search-ques-and-reviews', {
            search: query,
            modelId: JSON.parse(document.querySelector('section').dataset.data)
              .modelId,
          });

          searchQueryExecute = null;
        }, 1000);
      }
    );
  }

  _handleIntersectResponse(entries, observer) {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.closest('.product-ratings-overview')) {
          const ratingChart = el.querySelector('.product-rating-chart');
          ratingChart.dataset.race = true;
        }

        observer.unobserve(entry.target);
      }
    });
  }
  //  load first set of items when reach to row
  _handleIntersectEvent() {
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

    [this._ratingsChartContainer].forEach((el) => observer.observe(el));
  }

  add_hander_page(handle) {
    this._change_cur_img_when_preview_img_hovered();
    this.handle_parentel(handle);
    this._handleIntersectEvent();
  }
}
