import FormView from '../../../Common/PositionComponent/FormView.js';

export default class AskQuestionAboutProductForm extends FormView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="ask-question-about-product-form"]'
  );

  _form = this._parentel.querySelector('.form');
}
