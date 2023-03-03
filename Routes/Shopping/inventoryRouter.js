/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const inventoryController = require('../../Controller/Shopping/inventoryController');

Router.route('/').post(inventoryController.createInventory);
// Router.route('/:id')
//   .get(addressController.getAddress)
//   .delete(addressController.removeAddress)
//   .patch(addressController.updateAddress);

module.exports = Router;
