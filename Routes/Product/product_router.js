/* eslint-disable camelcase */
const express = require('express');

const productController = require('../../Controller/Product/product_controller');

// controller -----------------------
// const refreshTokenController = require('../Controller/refreshTokenController');
// const helper_controller = require('../Controller/helper_controller');
const {
  isLoggedIn,
  sendJwtIfNeeded,
  isLoggedInFunc,
} = require('../../Controller/jwtController');

const Router = express.Router({ mergeParams: true });

Router.get(
  '/search',

  productController.apiSearchProductTitle
);

// return search products in categories => rating,price,products
Router.get('/menu',isLoggedInFunc(true), productController.apiGetProductMenu)

Router.patch(
  '/modelId/:modelId/all-variants',
  productController.updateModelAllVariants
);

Router.patch('/postMan/updateModelAllVariants',productController.postManUpdateModelAllVariants);
 

// suggest-products
Router.get(
  '/suggest/type/:type/title/:title/modelId/:modelId',
  isLoggedIn,
  sendJwtIfNeeded(true),
  productController.getSuggestedProducts
);
Router.get(
  '/suggest/type/:type/title/:title/modelId/:modelId/count',
  isLoggedIn,
  sendJwtIfNeeded(true),
  productController.getSuggestedProductsTotalCount
);

Router.get('/:id', productController.apiGetProduct);

module.exports = Router;
