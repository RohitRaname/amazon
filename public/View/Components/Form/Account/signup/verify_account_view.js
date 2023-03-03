import FormView from '../../../../Common/PositionComponent/FormView.js';
export default class VerifyAccountView extends FormView {
  _parentel = document.querySelector('.form[data-type="verify-account"]');

  _additional_click_on_form(target, handle) {
    if (target.closest('button[data-action="resend-OTP"]'))
      handle('resend-OTP', {
        email: this._parentel.querySelector('input[name="email"]').defaultValue,
      });
  }
}
