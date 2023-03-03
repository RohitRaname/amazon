/* eslint-disable camelcase */
const express = require('express');

const wishlistRouter = require('./wishListRouter');
const meRouter = require('./meRouter');
const addressRouter = require('./addressRouter');
const historyRouter = require('./historyRouter');
const followRouter = require('./followRouter');
const cartRouter = require('./cartRouter');
const baseShoppingRouter = require('../Shopping/baseShoppingRouter');

const Router = express.Router();

// Controller -----------------------
const { protect, sendJwtIfNeeded } = require('../../Controller/jwtController');
const followingController = require('../../Controller/User/followController');

// Router.use('/', (req, res, next) => {
//   req.user = {
//     _id: '63ad447c3b31d43ac562d5d2',
//     currency: {
//       symbol: '₹',
//       code: 'INR',
//       rate: 81.6505,
//     },
//   };

//   next();
// });

Router.use(protect,sendJwtIfNeeded(true));

Router.use('/me/address', addressRouter);
Router.use('/me/history', historyRouter);
Router.use('/me/following', followRouter);

// userActivity cart to just store items
Router.use('/me/cart', cartRouter);

// this one order items
Router.use('/me/shopping', baseShoppingRouter);

// Router.use(protect, sendJwtIfNeeded(true));

Router.get('/me/following-users/:id', followingController.apiGetFollowingUsers);

Router.use('/me/wishlists', wishlistRouter);

// user doc update
Router.use('/me', meRouter);

module.exports = Router;
