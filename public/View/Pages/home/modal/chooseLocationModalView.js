import FormView from '../../../Common/PositionComponent/FormView.js';
export default class ChooseLocationModalView extends FormView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="choose-user-location"]'
  );

  _form = this._parentel.querySelector('.form');

  _locationEl = this._parentel.querySelector(
    '.modal-location-box [data-value]'
  );
  _headerDelieveryZipcodeEl = document.querySelector(
    'header [data-delievery-zipcode]'
  );

  render(positionbtnel, data) {
    const { city, state, country, zipcode } = data
    this._locationEl.textContent = `${state}, ${country}, ${zipcode}`;
  }

  _manuallyCheckInput(input) {
    if (input.name === 'zipcode') {
      if (!Number(input.value)) return true;
    }
  }

  _afterSubmitAddCode(data) {
    this._headerDelieveryZipcodeEl.textContent = data["zipcode"];
  }
}
