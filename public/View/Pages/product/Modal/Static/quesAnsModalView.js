import ModalView from '../../../../Common/PositionComponent/ModalView.js';
import { patch } from '../../../../../Controller/api/api.js';

export default class ProductSearchQuesAnsAndReviewsModal extends ModalView {
  _parentel = document.querySelector('.product-ques-ans');

  _generateMarkup(doc, windowName) {
    if (windowName === 'ques-ans') {
      const { _id, ques, ts, count, ans } = doc;

      let ansText, ansAuthor, answerOn;
      if (ans) {
        ansText = ans.text;
        ansAuthor = ans.author;
      }

      return `
      <div class="product-question-box f-sm">
          <!-- vote-->
          <div class="product-question-vote-box center">
            <button class="btn-icon-primary">
              <i class="fas fa-caret-up icon-bg" aria-hidden="true"></i>
            </button>
            <div class="product-question-vote-count">
              <p class="pt-sm w-500">${count.vote}</p>
              <p class="pt-sm w-500">vote</p>
            </div>
            <button class="btn-icon-primary">
              <i class="fas fa-caret-down icon-bg" aria-hidden="true"></i>
            </button>
          </div>
          <div class="line-v"></div>
          <div class="product-question-text g-m-1 gap-sm">
            <!-- question-->
            <p class="s-9">Question:</p>
            <a
              class="pt-md blue hover-primary"
              href="/ques-ans/${_id}"
              >${ques}</a
            ><!-- answer-->
            <p class="s-9">Answer:</p>
            <div class="product-question-answer mg-b-sm">
            <p class="pt-md">${ansText || 'I am the beast'}</p>
            <p class="product-question-answer-by t-sm mg-b-lw">
            By ${(ansAuthor && ansAuthor.name) || 'Rohit Rana'} On ${
        answerOn && answerOn.toLocateString()
      }
            </p>
            </div>
          </div>
        </div>
    `;
    }
  }

  _addCodeAfterDocLoad(initialLoad, loadDocs) {
    const leftQuesToShow =
      Number(this._activeLoadMoreDocBtn.dataset.totalQues) - loadDocs.length;

    this._activeLoadMoreDocBtn.querySelector(
      'span'
    ).textContent = `(${leftQuesToShow})`;

    this._activeLoadMoreDocBtn.dataset.totalQues = leftQuesToShow;
  }

  async click_on_content(target) {
    const voteBtn = target.closest('.product-ques-vote-btn');
    if (!voteBtn) return;

    // if (voteBtn.dataset.active === 'true') return;
    const { url } = voteBtn.dataset;
    const res = await patch(url, {}, false, true);
    if (res.message === 'item-exist') return;

    const voteBtnContainer = voteBtn.closest('.product-question-vote-box');

    const voteCountEl = voteBtnContainer.querySelector('[data-value]');

    const voteBtns = [...voteBtnContainer.querySelectorAll('button')];

    voteBtns.forEach((btn) => {
      btn.dataset.active = btn === voteBtn;
    });

    // updating the count value
    voteCountEl.textContent =
      voteBtn.dataset.action === 'increase'
        ? Number(voteCountEl.textContent) + 1
        : Number(voteCountEl.textContent) - 1;
  }
}
