import ConfirmPasswordView from '../../../../View/Components/Form/Account/Login/1.confirmPasswordView.js';

import { post } from '../../../api/api.js';

const form = document.querySelector('.form[data-type="login-enter-password"]');

const controlForm = async (action, data) => {
  if (action === 'submit-data'){

    post('auth/login/check-password', data,"/");
  } 
};

if (form) {
  const View = new ConfirmPasswordView();
  View.add_handler_el(controlForm);
}
