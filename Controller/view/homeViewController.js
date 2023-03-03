/* eslint-disable camelcase */
const Product = require('../../Model/Product/product_model');
const catchAsync = require('../../utils/catchAsync');
const productController = require('../Product/product_controller');
const AppError = require('../../utils/AppError');

exports.renderHomePage = catchAsync(async (req, res, next) => {
  const userData = req.restrictUserData

  const historyItems = userData && userData.history || [];

  const [addToCartItems, orderItems, row1, row2, row3] = await Promise.all([
    Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, title: '$title', thumbnail: '$assets.thumbnail' } },
    ]),
    Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, title: '$title', thumbnail: '$assets.thumbnail' } },
    ]),
    Product.aggregate([
      { $sample: { size: 21 } },
      { $project: { _id: 1, title: '$title', thumbnail: '$assets.thumbnail' } },
    ]),
    Product.aggregate([
      { $sample: { size: 21 } },
      { $project: { _id: 1, title: '$title', thumbnail: '$assets.thumbnail' } },
    ]),
    Product.aggregate([
      { $sample: { size: 21 } },
      { $project: { _id: 1, title: '$title', thumbnail: '$assets.thumbnail' } },
    ]),
  ]);


  return res.render('pages/homePage.pug', {
    page:"home",

    userData,
    historyItems,
    addToCartItems,
    orderItems,
    row1,
    row2,
    row3,
  });
});
