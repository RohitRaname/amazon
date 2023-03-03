/* eslint-disable camelcase */
const Product = require('../../../Model/Product/product_model');
const catchAsync = require('../../../utils/catchAsync');
const cartController = require('../../User/cartItemsController')

const AppError = require('../../../utils/AppError');

exports.renderCartPage = catchAsync(async (req, res, next) => {
  const docs = await cartController.getCartItems(
    req.user._id, 
    req.user.currency
  );

  const count =  docs.reduce(
    (acc, item) => acc + (Number(item.qty)),
    0
  );
  let totalAmount = docs.reduce(
    (acc, item) => acc + (Number(item.convertPrice.value)*Number(item.qty)),
    0
  );
  totalAmount = totalAmount.toFixed(2);

  res.render('pages/Shopping/Cart/page', {
    page: 'cart',
    userData: req.restrictUserData,

    docs,
    summary: {
      count,
      totalAmount,
    },
  });
});
