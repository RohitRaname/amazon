/* eslint-disable camelcase */
const express = require('express');

const reviewViewController = require('../../Controller/view/reviewController');

const { protect,sendJwtIfNeeded } = require('../../Controller/jwtController');

const Router = express.Router({ mergeParams: true });

Router.get(
  '/create-Review/:productId',
  protect,sendJwtIfNeeded(true),
  reviewViewController.renderCreateReviewPage
);

Router.get('/:productId',reviewViewController.renderFilterReviewPage)

module.exports = Router;
