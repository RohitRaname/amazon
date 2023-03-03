import { get,del,patch } from '../../../../Controller/api/api.js';
import { RatingIconsHtml } from '../../../Common/ratingIcons.js';

export default class HistoryPageView {
  _sectionEl = document.querySelector('.section-history');
  _gridEl = this._sectionEl.querySelector('.grid');
  _listEl = this._sectionEl.querySelector('.grid-container');
  _url;
  _page;
  _limit;
  _docsLeft;
  _skip;
  _maxSkip;

  // els
  _historyShowOptionsBtn = this._sectionEl.querySelector('.history-show-options-btn');
  _historyShowOptionsEl = this._sectionEl.querySelector('.history-options');
  _historyRecoredHintEl = this._sectionEl.querySelector(
    '.history-record-items-hint'
  );
  _historyRecoredBtn = this._sectionEl.querySelector('.history-on-off-btn');

  _generateItemMarkup(doc) {
    const { thumbnail, title, rating, _id } = doc;

    return `
    <a class="grid-item" href="/${title.split(' ').join('-')}/${_id}">
        <div class="img-box-hg pointer">
          <img src=${thumbnail}>
        </div>
        <p class="col-title mg-sl t-sm blue capitalize hover-color-primary">
          ${title}
        </p>
        <div class="f-lw f-ac mg-b-sl">
            <div class="product-rating-icons f f-ab">
                ${RatingIconsHtml(rating.value)}
            </div>
          <p class="t-sm hover-color-primary">${rating.value}</p>
        </div>
        <button
          class="btn-outline btn-lw"
          data-action="remove"
          data-url="/users/me/history/${_id}"
          >
          Remove from view
        </button>
    </a>
  `;
  }

  render(docs) {
    this._listEl.insertAdjacentHTML(
      'beforeend',
      docs.map((el) => this._generateItemMarkup(el)).join('')
    );
  }

  _setQueryParameters() {
    const { url, page, limit, docsLeft, skip, maxSkip } = this._gridEl.dataset;
    this._url = url;

    this._page = Number(page);
    this._skip = Number(skip);
    this._limit = Number(limit);
    this._maxSkip = Number(maxSkip);
    this._docsLeft = docsLeft === 'true';
  }

  async _loadDocs() {
    this._skip = this._skip + this._limit;

    console.log('skip-docs', this._skip);
    if (this._skip > this._maxSkip) {
      this._page = this._page + 1;
      this._skip = 0;
    }

    // settings attr in list
    this._gridEl.setAttribute('data-page', this._page);
    this._gridEl.setAttribute('data-skip', this._skip);

    const res = await get(`${this._url}&skip=${this._skip}&page=${this._page}`);
    console.log(res);
    const docs = res.data.docs;
    if (docs.length === 0) this._docsLeft = false;

    this._gridEl.setAttribute('data-docs-left', this._docsLeft);

    this.render(docs);
  }

  _handleIntersectResponse(entries, observer) {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.closest('.footer-container')) {
          this._loadDocs();
        }

        if (!this._docsLeft) observer.unobserve(el);
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

    [document.querySelector('.footer-container')].forEach((el) =>
      observer.observe(el)
    );
  }

  _handlePage() {
    this._sectionEl.addEventListener('click', (e) => {
      const target = e.target;

      // show history options
      if (target.closest('.history-show-options-btn')) {
        this._historyShowOptionsBtn.dataset.active =
          this._historyShowOptionsBtn.dataset.active === 'true' ? false : true;
        this._historyShowOptionsEl.classList.toggle('hidden');
      }

      // remove all history items
      if(target.closest('[data-action="remove-all-history-items"]')){
        this._gridEl.innerHTML=""
        del(`users/me/history`)


      }
      
      // remove single item
      if(target.closest('[data-action="remove"]')){
        target.closest('.grid-item').remove()
        del(target.closest('[data-action="remove"]').dataset.url)
      }



      // enable/disable record history
      if (target.closest('.history-on-off-btn')) {
        this._historyRecoredBtn.dataset.active =
          this._historyRecoredBtn.dataset.active === 'true' ? false : true;
        this._historyRecoredHintEl.classList.toggle('hidden');

        // record history or disable
      this._historyRecoredBtn.dataset.active==="true"? patch('users/me',{recordHistory:true}): patch('users/me',{recordHistory:false})
        
      }
    });
  }

  add_handler_el() {
    this._setQueryParameters();
    this._handleIntersectEvent();
    this._handlePage();
  }
}
