import { get } from '../../../../../Controller/api/api.js';
import ModalView from '../../../../Common/PositionComponent/ModalView.js';
import { RatingIconsHtml } from '../../../../Common/ratingIcons.js';

export default class ReviewListModalView extends ModalView {
  _parentel = document.querySelector('.review-list-modal');
  _reviewQueryTextAndFilterCountContainerEl = this._parentel.querySelector(
    '.review-filter-query-and-count'
  );
  _reviewFilterCount = this._parentel.querySelector('.review-filter-count');
  _reviewFilterOptionBtns = [
    ...this._parentel.querySelectorAll('.review-filter-options button'),
  ];
  _reviewFilterDropdowns = [
    ...document.querySelectorAll('.review-filter-dropdowns .dropdown'),
  ];
  _searchReviewInput = document.querySelector('.search-review-input');

  _generateMarkup(doc) {
    const { _id, author, content, product, rating, count, ts, highlights } =
      doc;

    author.name = this._stringifyText(author.name);
    author.country = this._stringifyText(author.country);
    content.title = this._stringifyText(content.title);
    content.text = this._stringifyText(content.text);
    product.size = this._stringifyText(product.size);

    return ` <div
    class="review mg-b-md"
    data-data=${JSON.stringify({ ...doc, highlights: '' })}
  >
    <!-- author | rating | review-title | review-date | product-spec-->
    <div class="review-header">
      <a class="f-sm f-ac mg-b-sl pointer" href="/profile/${author._id}"
        ><img
          class="img-sl round review-author-img"
          src="/img/users/${author.pic}"
          alt=""
        />
        <p class="pt-md review-author-name">${this._parseText(
          author.name
        )}</p></a
      ><!-- rating | review-title--><a
        class="f-sm f-ab pointer"
        href="/reviews/${_id}"
        ><div class="f-sl product-rating-icons">
          ${RatingIconsHtml(rating)}
        </div>
        <p class="s-9 s-d hover-primary">
          ${
            highlights &&
            highlights.length > 0 &&
            highlights.find((el) => el.path === 'content.title') &&
            highlights.find((el) => el.path === 'content.title').texts.length >
              0
              ? `${highlights
                  .find((el) => el.path === 'content.title')
                  .texts.map(
                    (el) =>
                      `<span class="${
                        el.type === 'hit' ? 'highlight-bg-primary' : ''
                      }">
                    ${el.value}
                  </span>`
                  )
                  .join('')}`
              : this._parseText(content.title)
          }
        </p></a
      ><!-- date-of-review-->
      <div>
        <p class="t-md review-postat">
          Reviewed in<span
            class="review-author-country letter-s"
            >${this._parseText(author.country)} ${this._date(ts)}</span
          >
        </p>
      </div>
      <!-- about-product-->
      <div class="f-sm review-product-details mg-b-sl">
        <p class="t-md">
          Colour: <span class="letter-s">${product.color}</span>
        </p>
        |
        <p class="t-md">
          Size name: <span class="letter-s">${this._parseText(
            product.size
          )}</span>
        </p>
        |
        <p class="pt-md primary w-600">Verified Purchase</p>
      </div>
    </div>
    <!-- review-text | review-img | review-stats-->
    <footer class="review-footer">
      <!-- review-text-->
      <div class="review-text-box pt-md">
        <p class="mg-b-sl">    ${
          highlights &&
          highlights.length > 0 &&
          highlights.find((el) => el.path === 'content.text') &&
          highlights.find((el) => el.path === 'content.text').texts.length > 0
            ? `${highlights
                .find((el) => el.path === 'content.text')
                .texts.map(
                  (el) =>
                    `<span class="${
                      el.type === 'hit' ? 'highlight-bg-primary' : ''
                    }">
                ${el.value}
              </span>`
                )
                .join('')}`
            : this._parseText(content.text)
        }</p>
      </div>
      <!-- review-imgs-->
      <div class="review-imgs mg-b-sl f-lw">
      ${content.photos
        .map(
          (photo) =>
            `<img
        src="/img/reviews/${photo}"
        class="img-lw r-sm review-img"
        alt=""
        
        />`
        )
        .join('')}
 
    </div>
      <!-- review-helpful-count-->
      <div class="review-helpful-box">
        <p class="t-sm mg-b-sm">
          <span class="review-helpful-count" data-value=""
            >${count.helpful}</span
          >
          found this helful
        </p>
        <!-- review-btns-->
        <div class="f-sm f-ab">
          <button
            class="btn-outline review-helpful-btn"
            data-url="products/${
              product._id
            }/reviews/${_id}/count/increase?field=helpful"
            data-need-login-user=""
          >
            Helpful
          </button>
          <div class="dim">|</div>
          <button class="btn-text-dull" data-need-login-user="">
            Report abuse
          </button>
        </div>
      </div>
    </footer>
  </div>`;
  }

  _addCodeAfterDocLoad(initialLoad, data) {
    if (initialLoad) {
      this._reviewQueryTextAndFilterCountContainerEl.classList.remove('hidden');

      const [docsRes, docsCountRes] = data;

      this._reviewFilterCount.textContent = `${docsCountRes.count} reviews`;
    }
  }

  async renderFilterReviewDocs(filterQueryStringObj) {
    const { queryString, listItemClicked } = filterQueryStringObj;
    console.log(listItemClicked.querySelector('p').textContent);
    this._activeWindow.setAttribute('data-filter-query', queryString);
    this._loadDocsAndRender(this._generateUrl(), true, this._generateUrl(true),true);
  }

  async renderSearchReviews(searchWord) {
    console.log(searchWord);

    this._activeWindow.setAttribute('data-search-query', `${searchWord}`);
    this._loadDocsAndRender(this._generateUrl(), true, this._generateUrl(true),true);
  }

  async click_on_content(target, handle) {
    if (target.closest('button[data-action="clear-review-filter"]')) {
      this._activeWindow.setAttribute('data-filter-query', '');
      this._activeWindow.setAttribute('data-search-query', '');
      this._activeWindow.setAttribute('data-page', 0);
      this._searchReviewInput.value = '';

      this._reviewQueryTextAndFilterCountContainerEl.classList.add('hidden');

      this._reviewFilterDropdowns.forEach((el, i) => {
        this._activeel_in_arr(el.querySelector('.list-item'), [
          ...el.querySelectorAll('.list-item'),
        ]);

        this._reviewFilterOptionBtns
          .find(
            (btn) =>
              btn.getAttribute('data-positionel-name') ===
              el.getAttribute('data-positionel-name')
          )
          .querySelector('p').textContent =
          el.querySelector('.list-item p').textContent;
      });
    }

    console.log(target);

    // click revewi-img
    if (target.closest('.review-img')) {
      console.log('clicked');
      handle(
        'show-clicked-review-overview-in-modal',
        target.closest('.review')
      );
    }
  }
}
