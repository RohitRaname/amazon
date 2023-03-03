import SetNewPassword from '../../../../View/Components/Form/Account/forgotPassword/2.setNewPasswordView.js';
import { patch, get } from '../../../api/api.js';
const form = document.querySelector('.form[data-type="set-new-password"]');

const controlForm = async (action, data) => {
  console.log(data);
  if (action === 'submit-data') {
    const res = await patch('auth/forgotPassword/setNewPassword', data, `/`);
  }
};

if (form) {
  const View = new SetNewPassword();
  View.add_handler_el(controlForm);
}
