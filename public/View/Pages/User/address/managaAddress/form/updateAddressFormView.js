import { get } from '../../../../../../Controller/api/api.js';
import FormView from '../../../../../Common/PositionComponent/FormView.js';

export default class UpdateAddressFormView extends FormView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="update-address"]'
  );

  // form
  _form = this._parentel.querySelector('.form');
    _countryLabel = this._form.querySelector('.form-group[data-field="country"] .form-label');

  // page changes update




  render(positionbtnel, data) {

    // update the url according to address selected
    this._form.dataset.url=this._form.dataset.baseUrl + `/${data._id}`

    console.log(data);
    Object.keys(data).forEach((field) => {
      const input = this._form.querySelector(`input[name=${field}]`);
      if(!input) return;
      input.value = data[field];
    });

    this._countryLabel.textContent = data.country;
  }

  _afterSubmitAddCode(data){
    // find addressSetBox in page 
    const addressSetBox= document.querySelector(`.address-set-box[data-id="${data._id}"]`)

    Object.keys(data).forEach((field) => {
      const spanEl = addressSetBox.querySelector(`[data-${field}]`);
      if(!spanEl) return;
      spanEl.textContent = data[field];
    });
  }

  async _loadQueryDataAndRender(positionbtneldata, url) {
    console.log(url);
    const res = await get(`${url}/${positionbtneldata._id}`);
    console.log(res);
    this.render(positionbtneldata, res.data);
  }
}
