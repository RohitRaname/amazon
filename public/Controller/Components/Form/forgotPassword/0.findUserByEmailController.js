import forgotPasswordFindAccountView from '../../../../View/Components/Form/Account/forgotPassword/0.findAccountView.js';

import { post } from '../../../api/api.js';
const form = document.querySelector(
  '.form[data-type="forgot-password-find-account"]'
);




const controlForm = async (action, data) => {
  console.log(action,data);
  if (action === 'submit-data') {
    await post(
      `auth/check-email`,
      data,
      `/auth/forgotPassword/1?email=${data.email}`
    );
  }
};

if (form) {
  const View = new forgotPasswordFindAccountView();
  View.add_handler_el(controlForm);
}
