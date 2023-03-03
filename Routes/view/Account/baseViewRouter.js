/* eslint-disable camelcase */
const express = require('express');

const addressViewRouter = require('./addressViewRouter');
const {
  protect,
  sendJwtIfNeeded,
} = require('../../../Controller/jwtController');
const {
  setRestrictUserDataInReq,
} = require('../../../Controller/User/userController');

const Router = express.Router({ mergeParams: true });

Router.use(
  '/address',
  protect,
  sendJwtIfNeeded(true),
  setRestrictUserDataInReq,
  addressViewRouter
);

module.exports = Router;
