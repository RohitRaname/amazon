/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const shopppingCartController = require('../../Controller/Shopping/shoppingCartController');

Router.post('/checkout', shopppingCartController.checkout);
Router.patch('/:id/rollback', shopppingCartController.apiRollbackCart);
Router.patch('/:id/commit', shopppingCartController.apiCommitCart);
Router.patch('/:id/retire', shopppingCartController.apiRetireCart);

Router.patch('/:id', shopppingCartController.updateShoppingCartItemQty);
Router.delete(
  '/:id/item/:itemId/qty/:qty',
  shopppingCartController.deleteCartItem
);

// Router.route('/:id')
//   .get(addressController.getAddress)
//   .delete(addressController.removeAddress)
//   .patch(addressController.updateAddress);

module.exports = Router;
