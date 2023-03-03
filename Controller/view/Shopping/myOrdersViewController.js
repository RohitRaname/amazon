/* eslint-disable camelcase */
const catchAsync = require('../../../utils/catchAsync');
const orderController = require('../../Shopping/orderController');

exports.renderMyOrdersPage = catchAsync(async (req, res) => {
  // create cart with selected items
  const userId = req.user._id;

  const orderItemsTimeFilterQuery =  new Date(new Date().setDate(new Date().getDate() - 90))

  // get orders in last 3 months
  req.query['ts'] = {
    gt: orderItemsTimeFilterQuery,
  };

  req.query.limit = 5;

  const [orderItems, totalOrderItemsCountDuringTimePeriod] = await Promise.all([
    orderController.getOrdersItems(userId, req.query),
    orderController.getTotalOrderItemsCount(userId, req.query),
  ]);

  console.log(totalOrderItemsCountDuringTimePeriod);

  return res.render('pages/Shopping/myOrders/page.pug', {
    page: 'myOrder',
    userData: req.restrictUserData,

    orderItems,
    totalOrderItemsCountDuringTimePeriod,

    orderItemsTimeFilterQuery
  });
});
