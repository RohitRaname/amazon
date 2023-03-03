/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router({mergeParams:true});

// controller -----------------------
const wishlistController = require('../../Controller/User/wishlistController');

// wishlist product
Router.post('/:id/add-product', wishlistController.addItemToWishlist);
Router.delete(
  '/:wishlistId/remove-product/:productId',
  wishlistController.removeItemFromWishlist
);

// wishlist
Router.route('/')
  .post(wishlistController.createWishlist)
  .patch(wishlistController.updateWishlistsAllItems)
  .get(wishlistController.apiGetWishlists);

// wishlist items
Router.route('/:id')
  .delete(wishlistController.removeWishlist)
  .get(wishlistController.apiGetWishlistItems)
  .post(wishlistController.addItemToWishlist)

Router.patch(
  '/:fromWishlistId/move-item-to-list/:toWishlistId',
  wishlistController.moveItemBwWishlist
);

// return users wishlist length
Router.get('/total/count', wishlistController.getMyWishlistCount);

module.exports = Router;
