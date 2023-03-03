/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const addressController = require('../../Controller/User/addressController');

Router.route('/').post(addressController.addAddress);
Router.route('/:id')
  .get(addressController.getAddress)
  .delete(addressController.removeAddress)
  .patch(addressController.updateAddress);

Router.patch('/:id/update-zipcode',addressController.updateAddressZipcode)

module.exports = Router;
