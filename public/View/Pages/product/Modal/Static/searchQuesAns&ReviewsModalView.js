import ModalView from '../../../../Common/PositionComponent/ModalView.js';
import { RatingIconsHtml } from '../../../../Common/ratingIcons.js';

export default class ProductSearchQuesAnsAndReviewsModal extends ModalView {
  _parentel = document.querySelector(
    '.product-search-matching-ques-ans-and-reviews-modal'
  );

  _quesPreviewWindow = this._parentel.querySelector(
    '[data-window-preview="ques-ans"]'
  );
  _reviewsPreviewWindow = this._parentel.querySelector(
    '[data-window-preview="reviews"]'
  );

  _generateQuesMarkup(doc) {
    let { _id, ques, ts, count, ans, highlights } = doc;

    let ansText, ansAuthor, answerOn;
    if (ans) {
      ansText = ans.text;
      ansAuthor = ans.author;
    }

    ques = highlights.find((el) => el.path === 'ques')?.texts;

    return `
              <div class="modal-item mg-b-sl-all">
                      <!-- ques-ans--><!-- ques-->
                      <p class="s-9">
                          <span>Q: </span>
                     
                          ${
                            Array.isArray(ques)
                              ? ques
                                  .map((el) => {
                                    if (el.type === 'text')
                                      return ` <span>${el.value}</span>`;
                                    if (el.type === 'hit')
                                      return ` <span class="highlight-bg-primary">${el.value}</span>`;
                                  })
                                  .join('')
                              : ques
                          }
                      </p>
                      <!-- ans-->
                      <p class="pt-md">
                      <span class="s-9 inline">A: </span>${
                        ansText || 'I am super powerful'
                      }</span>
                 
                      </p>
                      <!-- author-->
                      <a class="t-md" >By <span class="btn-inline-u">Rohit</span> on 6 November,2022</a
                      >
              </div>
    
      `;
  }

  _generateReviewMarkup(doc) {
    const { content, ts, author, highlights } = doc;
    let { title, text, rating } = content;

    console.log('highlights', highlights);

    if (highlights.length > 0) {
      title = highlights.find((el) => el.path === 'content.title')?.texts;
      text = highlights.find((el) => el.path === 'content.text')?.texts;
    }

    return `
      <div class="modal-item mg-b-sl-all">
          <!-- rating | review-title-->
          <div class="f-sm f-ab">
          <div class="f product-rating-icons">
              ${RatingIconsHtml(rating, 'icon-sm')}
          </div>
          <p class="s-9 s-d">
                      
          ${
            Array.isArray(title)
              ? title
                  .map((el) => {
                    if (el.type === 'text') return ` <span>${el.value}</span>`;
                    if (el.type === 'hit')
                      return ` <span class="highlight-bg-primary">${el.value}</span>`;
                  })
                  .join('')
              : title
          }
          </p>
          </div>
          <!-- author-->
          <p class="t-md">
          By <a href=/profile/${author._id} class="btn-inline-span">${
      author.name
    }</a> on ${ts.toLocaleString()}
          </p>
          <!-- text | button-->
          <p class="pt-md mg-b-lw">
          ${
            Array.isArray(text)
              ? text
                  .map((el) => {
                    if (el.type === 'text') return ` <span>${el.value}</span>`;
                    if (el.type === 'hit')
                      return ` <span class="highlight-bg-primary">${el.value}</span>`;
                  })
                  .join('')
              : text
          }
         
          </p>
          </div>
      </div>

  `;
  }

  _generateMarkup(doc, windowName) {
    if (windowName === 'ques-ans') return this._generateQuesMarkup(doc);
    if (windowName === 'reviews') return this._generateReviewMarkup(doc);
  }

  render(windowName, doc_arr, clear_html = true, returnHtml = false) {
    const modalList = this._parentel.querySelector(
      `.modal-window[data-window="${windowName}"] .modal-list`
    );

    //
    if (windowName === 'all') {
      const { reviewDocs, quesAnsDocs } = doc_arr;

      reviewDocs.length === 0
        ? this._reviewsPreviewWindow.classList.add('hidden')
        : this._reviewsPreviewWindow.classList.remove('hidden');
      quesAnsDocs.length === 0
        ? this._quesPreviewWindow.classList.add('hidden')
        : this._quesPreviewWindow.classList.remove('hidden');

      const reviewPreviewModalList =
        this._reviewsPreviewWindow.querySelector('.modal-list');
      const quesAnsPreviewModalList =
        this._quesPreviewWindow.querySelector('.modal-list');
      reviewPreviewModalList.innerHTML = '';
      quesAnsDocs.innerHTML = '';

      const reviewsHTML = reviewDocs
        .slice(0, 2)
        .map((doc) => this._generateMarkup(doc, 'reviews'))
        .join('');
      const quesAnsDocsHTML = reviewDocs
        .slice(0, 2)
        .map((doc) => this._generateMarkup(doc, 'ques-ans'))
        .join('');

      reviewPreviewModalList.innerHTML = reviewsHTML;
      quesAnsPreviewModalList.innerHTML = reviewsHTML;


      console.log('docs-length',reviewDocs,quesAnsDocs)

      // updating the preview doc total count
      this._reviewsPreviewWindow
        .querySelector('[data-window-change-btn]')
        .querySelector('span[data-value]').textContent = reviewDocs.length;
      this._quesPreviewWindow
        .querySelector('[data-window-change-btn]')
        .querySelector('span[data-value]').textContent = quesAnsDocs.length;

      return;
    }

    if (clear_html) modalList.innerHTML = '';

    const html = doc_arr
      .map((doc) => this._generateMarkup(doc, windowName))
      .join('');

    if (returnHtml) return html;
    modalList.insertAdjacentHTML('beforeend', html);
  }
}

// {/* <span
// class="highlight-bg-primary"
// >sim card</span
// >in this ? */}
