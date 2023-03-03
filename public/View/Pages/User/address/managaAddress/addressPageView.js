import { del } from '../../../../../Controller/api/api.js';
import AlertView from '../../../../Components/Alert/AlertView.js';

export default class addressPageView {
  _parentel = document.querySelector('.section-manage-address');

  _handlePage() {
    this._parentel.addEventListener('click', (e) => {
      const target = e.target;

      if (target.closest('button[data-action="remove"]')) {
        const setAddresBoxCount = [
          ...this._parentel.querySelectorAll('.address-set-box'),
        ].length;
        if (setAddresBoxCount === 1) {
          console.log('called');
          return new AlertView().render(
            'Please add a new address before as amazon need atleast one address',
            false
          );
        }
        const { url } = target.closest('button[data-action="remove"]').dataset;
        const addressBox = target.closest('.address-set-box');
        del(url);
        addressBox.remove();
      }
    });
  }

  add_handler_el(handle) {
    this._handlePage();
  }
}
