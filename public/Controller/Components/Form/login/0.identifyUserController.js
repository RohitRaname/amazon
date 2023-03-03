import IdentityUserView from '../../../../View/Components/Form/Account/Login/0.identifyUserView.js';

import { post } from '../../../api/api.js';
const form = document.querySelector('.form[data-type="login-enter-email"]');

const controlForm = async (action, data) => {
  if (action === 'submit-data')
    post(`auth/check-email`, data, `/auth/login/1?email=${data.email}`);
};

if (form) {
  const View = new IdentityUserView();
  View.add_handler_el(controlForm);
}
