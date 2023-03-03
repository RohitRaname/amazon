import { addClass, removeClass } from '../utils/domHelper.js';

class ErrorView {
  _parentEl;

  render(message,staticEl=true) {
    this._clear();

    this._parentEl.innerHTML="";
    const html = this._generateMarkUp(message);
    
    this._parentEl.insertAdjacentHTML('afterbegin', html);


    removeClass(this._parentEl, 'hidden');

    if(!staticEl)
    this._removeMessageFromDOM();
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  _removeMessageFromDOM() {
    setTimeout(() => {
      this._clear();
      addClass(this._parentEl, 'hidden');
    }, 5000);
  }
}

export default ErrorView;
