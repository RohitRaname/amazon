import VerifyAccountView from '../../../../View/Components/Form/Account/signup/verify_account_view.js';
import { post, get} from '../../../api/api.js';
const form = document.querySelector(
  '.form[data-type="verify-account"]'
);

const controlForm = async (action, data) => {
  console.log(data);
  if (action === 'submit-data') {
    const res = await post(
      'auth/signup/verify-account',
      data,
      `/`
    );
  }

  if(action==="resend-OTP")  get(`auth/signup/resend-token/${data.email}`)
};

if (form) {
  const View = new VerifyAccountView();
  View.add_handler_el(controlForm);
}
