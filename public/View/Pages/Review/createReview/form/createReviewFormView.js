import FormView from '../../../../Common/PositionComponent/FormView.js';

export default class createReviewFormView extends FormView {
  _parentel = document.querySelector('.createReview-form');

  _ratingIcons = [...this._parentel.querySelectorAll('.product-rating-icon')];
  _ratingInputEl = this._parentel.querySelector('[name="rating"]');

  _reviewGroupEl = this._parentel.querySelector(
    '.form-group[data-field="review"]'
  );
  _reviewNoValueErrorEl = this._reviewGroupEl.querySelector(
    '.form-error[data-type="no-value"]'
  );

  _reviewInsufficientWords = this._reviewGroupEl.querySelector(
    '.form-error[data-type="insufficient-words"]'
  );

  _manuallyCheckInput(input) {
    if (input.name === 'content_text' && input.value === '') {
      this._reviewNoValueErrorEl.classList.remove('hidden');
      this._reviewInsufficientWords.classList.add('hidden');
      return true;
    }
    if (input.name === 'content_text' && input.value.length < input.minLength) {
      this._reviewNoValueErrorEl.classList.add('hidden');
      this._reviewInsufficientWords.classList.remove('hidden');
      this._reviewInsufficientWords.querySelector('[data-value]').textContent =
        50 - input.value.length;
      return true;
    }
    if (
      (input.name === 'content_rating' && input.value === '0') ||
      input.value === ''
    )
      return true;
  }

  _reset_parentel() {}

  _afterSubmitAddCode() {}

  _additional_click_on_form(target) {
    // click on rating icons
    if (target.closest('.product-rating-icon')) {
      const formGroupEl = target.closest('.form-group');

      formGroupEl.dataset.valueSet = true;

      let { index } = target.closest('.product-rating-icon').dataset;
      index = Number(index);

      this._ratingIcons.forEach((el, i) => {
        i <= index
          ? el.classList.replace('fa-star-o', 'fa-star')
          : el.classList.replace('fa-star', 'fa-star-o');
      });

      this._ratingInputEl.value = index + 1;
      formGroupEl.dataset.error = false;
    }

    if (target.closest('.form-clearbtn')) {
      const formGroupEl = target.closest('.form-group');

      formGroupEl.dataset.valueSet = false;

      this._ratingIcons.forEach((el, i) => {
        el.classList.replace('fa-star', 'fa-star-o');
      });

      this._ratingInputEl.value = 0;
    }
  }
}
