import CreateAccountView from '../../../../View/Components/Form/Account/signup/create_account_view.js';
import { post } from '../../../api/api.js';
const createAccountForm = document.querySelector(
  '.form[data-type="create-account"]'
);

const controlCreateAccount = async (action, data) => {
  console.log(data);
  if (action === 'submit-data') {
    const res = await post(
      'auth/signup/create-account',
      data,
      `/auth/signup/verify-account?email=${data.email}`
    );
  }
};

if (createAccountForm) {
  const View = new CreateAccountView();
  View.add_handler_el(controlCreateAccount);
}
 