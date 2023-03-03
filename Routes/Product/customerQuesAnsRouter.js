/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router({ mergeParams: true });

// controller -----------------------
const customerQuesAnsController = require('../../Controller/Product/CustomerQues&AnsController');
const { protect, sendJwtIfNeeded } = require('../../Controller/jwtController');

Router.get('/search', customerQuesAnsController.searchQues);

// count field update
Router.patch(
  '/:id/count/:action',
  protect,
  sendJwtIfNeeded(true),
  customerQuesAnsController.updateQuesCountField
);

Router.route('/')
  .get(customerQuesAnsController.getProductQuestions)
  .post(customerQuesAnsController.createQues)
  .delete(customerQuesAnsController.deleteProductAllQuestion);

Router.patch('/:id', customerQuesAnsController.updateQues);

// ADMIN --------------------------------------
Router.route('/admin')
  .get(customerQuesAnsController.apiAdminGetCustomerQuesAnss)
  .post(customerQuesAnsController.apiAdminCreateCustomerQuesAns);

Router.route('/admin/:id')
  .get(customerQuesAnsController.apiAdminGetCustomerQuesAns)
  .patch(customerQuesAnsController.apiAdminUpdateCustomerQuesAns)
  .delete(customerQuesAnsController.apiAdminDeleteCustomerQuesAns);

module.exports = Router;
