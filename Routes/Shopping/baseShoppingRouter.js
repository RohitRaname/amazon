/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const shoppingCartRouter = require('./shoppingCartRouter');
const orderRouter=require('./orderRouter')

Router.use('/cart',shoppingCartRouter)
Router.use('/order',orderRouter)


// Router.route('/:id')
//   .get(addressController.getAddress)
//   .delete(addressController.removeAddress)
//   .patch(addressController.updateAddress);

module.exports = Router;
