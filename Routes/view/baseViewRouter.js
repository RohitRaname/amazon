/* eslint-disable camelcase */
const Router = require('express').Router();

const productViewRouter = require('./productViewRouter');
const reviewViewRouter = require('./reviewViewRouter');
const baseAccountViewRouter = require('./Account/baseViewRouter');
const authViewRouter = require('./authViewRouter');
const baseMeViewRouter = require('./User/baseRouter');

// Controller
const {
  isLoggedIn,
  protect,
  sendJwtIfNeeded,
} = require('../../Controller/jwtController');
const {
  setUserCurrencyAndAddressForOnce,
  setRestrictUserDataInReq,
} = require('../../Controller/User/userController');
const commonViewController = require('../../Controller/view/commonViewController');
const homeViewController = require('../../Controller/view/homeViewController');
const userProfileViewController = require('../../Controller/view/User/userProfileViewController');
const productMenuViewController = require('../../Controller/view/productMenuViewController');
const productViewController= require('../../Controller/view/product_view_controller')

// account => login/signup/forgotPassword

Router.use('/img*', (req, res) => res.status(400).send('img not found'));
Router.use('/api*', (req, res) => res.send('api not found'));

Router.get('/logout', commonViewController.logout);

Router.use('/auth', authViewRouter);
Router.use('/account', baseAccountViewRouter);

Router.get(
  '/profile/:id',
  isLoggedIn,
  sendJwtIfNeeded(true),
  setRestrictUserDataInReq,
  userProfileViewController.renderUserProfile
);

Router.use(
  '/me',
  protect,
  sendJwtIfNeeded(true),
  setRestrictUserDataInReq,
  baseMeViewRouter
);

Router.use(
  isLoggedIn,
  sendJwtIfNeeded(true),
  setUserCurrencyAndAddressForOnce,
  setRestrictUserDataInReq
);

Router.use('/review', reviewViewRouter);
Router.get('/menu', productMenuViewController.renderProductMenuPage);

Router.get('/:title/:id', productViewController.renderProductPage);
Router.get(['/', '/home'], homeViewController.renderHomePage);

module.exports = Router;
