/* eslint-disable camelcase */
const express = require('express');

const addressViewController = require('../../../Controller/view/User/addressViewController');

const Router = express.Router({ mergeParams: true });

Router.get(
  '/',

  addressViewController.renderManageAddresses
);

Router.get(
  '/add',

  addressViewController.renderAddAddress
);

module.exports = Router;
