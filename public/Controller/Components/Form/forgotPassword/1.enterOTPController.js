import EnterOTPView from '../../../../View/Components/Form/Account/forgotPassword/1.enterOTPView.js';
import { post, get } from '../../../api/api.js';
const form = document.querySelector(
  '.form[data-type="forgotPassword-enter-token"]'
);

const controlForm = async (action, data) => {
  console.log(data);
  if (action === 'submit-data') {
    const res = await post(
      'auth/verify-token',
      data,
      `/auth/forgotPassword/2?email=${data.email}`
    );
  }

  if (action === 'resend-OTP')
    get(`auth/forgotPassword/resend-token/${data.email}`);
};

if (form) {
  const View = new EnterOTPView();
  View.add_handler_el(controlForm);
}
