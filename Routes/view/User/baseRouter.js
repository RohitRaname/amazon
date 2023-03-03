/* eslint-disable camelcase */
const express = require('express');

const historyViewController = require('../../../Controller/view/User/historyViewController');
const wishlistViewController = require('../../../Controller/view/User/wishlistViewController');
const cartViewController= require('../../../Controller/view/User/cartViewController')
const checkoutViewController= require('../../../Controller/view/Shopping/checkoutViewController')
const addressViewController= require('../../../Controller/view/User/addressViewController')
const myOrdersViewController= require('../../../Controller/view/Shopping/myOrdersViewController')
const accountViewController= require('../../../Controller/view/User/accountViewController')


const Router = express.Router({ mergeParams: true });

Router.get('/history', historyViewController.renderHistoryPage);
Router.get('/wishlists/:id', wishlistViewController.renderWishlistPage);
Router.get('/address', addressViewController.renderManageAddresses);
Router.get('/address/add', addressViewController.renderAddAddress);

Router.get('/cart',cartViewController.renderCartPage)
Router.get('/checkout',checkoutViewController.renderCheckoutPage)
Router.get('/orders',myOrdersViewController.renderMyOrdersPage)
Router.get('/account',accountViewController.renderAccountPage)

module.exports = Router;
