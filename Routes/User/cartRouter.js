/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const userActivityCartController = require('../../Controller/User/cartItemsController');

Router.route('/')
  .post(userActivityCartController.addItemToCart)
  .get(userActivityCartController.apiGetCartItems);

// cart total items and total Price
Router.get('/summary', userActivityCartController.getCartSummary);

Router.get(
  '/items/count',
  userActivityCartController.apiGetCartItemsTotalCount
);

// remove or update cart item qty
// route should be here => Router.route('/item/:itemId/qty/:qty)

Router.route('/:id/qty/:qty')
  .delete(userActivityCartController.removeItemFromCart)
  .patch(userActivityCartController.updateItemQtyInCart);

module.exports = Router;
