/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const orderController = require('../../Controller/Shopping/orderController');

// order is completed
Router.post('/cart/:cartId', orderController.order);

Router.get('/items/buy-again',orderController.apiGetBuyAgainItems)
Router.get('/items/count',orderController.apiGetTotalOrderItemsCount)
Router.get('/items',orderController.apiGetOrdersItems);

// Router.route('/:id')
//   .get(addressController.getAddress)
//   .delete(addressController.removeAddress)
//   .patch(addressController.updateAddress);

module.exports = Router;
