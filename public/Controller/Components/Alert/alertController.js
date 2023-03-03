import AlertMessageView from '../../../View/Components/Alert/AlertView.js';
let View;

export const alertError = (errorObj,elPositionType) => {
  View.render(errorObj,elPositionType);
};
export const successAlert = (res) => {
  const errorMessage = res.response.data.message;

  View.render(errorMessage, 'alert');
};

View= new AlertMessageView();


