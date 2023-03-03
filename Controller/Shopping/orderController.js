const mongoose = require('mongoose');

const catchAsync = require('../../utils/catchAsync');
const tryCatch = require('../../utils/tryCatch');
const {
  formatQueryIntoMongodbFormat,
} = require('../../utils/mongodbQueryConverter');

const send = require('../../utils/sendJSON');
const AppError = require('../../utils/AppError');
const UserActivity = require('../../Model/user/userActivityModel');
const topLevelBucketController = require('../../Controller/userBucketController/topLevelList');
const shoppingCartController = require('../Shopping/shoppingCartController');
const userActivityCartController = require('../../Controller/User/cartItemsController');

//////////////////////////////////////////
// ORDER ITEMS
//////////////////////////////////////////
// save orders items in orderItems arr in userActivity Fields
exports.saveOrderItemsSeparately = tryCatch(
  async (userId, orderItems, orderSummary) => {
    orderItems = orderItems.map((el) => ({ item: el, summary: orderSummary }));

    await topLevelBucketController.addItemsToList(
      UserActivity,
      userId,
      'orderItems',
      orderItems,
      {
        checkItemExist: false,
        deleteItemExist: false,
      },
      {
        update: false,
      }
    );
  }
);

exports.getTotalOrderItemsCount = tryCatch(async (userId, query) => {
  const count = await topLevelBucketController.getTotalItemsCount(
    UserActivity,
    userId,
    {
      listName: 'orderItems',
      sort:'ts',
      filter: {             
        item: formatQueryIntoMongodbFormat(query).match ,
      },
    }
  );

  return count;
});

exports.getOrdersItems = tryCatch(async (userId, query) => {
  const mongoQuery = formatQueryIntoMongodbFormat(query);
  mongoQuery.listName = 'orderItems';
  mongoQuery.directContainItems = true;
  mongoQuery.sort = '-ts';
  


  // filter order items by time range (orders after last 3months, after 2022 year)
  mongoQuery.filter={item:{ts:mongoQuery.match.ts}}

  delete mongoQuery.match.ts;

  const orderItems = await topLevelBucketController.getEmbeddedItems(
    UserActivity,
    userId,
    mongoQuery
  );


  return orderItems;
});

exports.getBuyAgainItems = tryCatch(async (userId, query) => {
  const items = await topLevelBucketController.getRefItems(UserActivity, userId, {
    listName: 'orderItems',
    limit: query.limit,
    sort: 'ts',
    project: null,
    directContainItems: true,
   
    lookup: {
      from: 'products',
      localField: 'item._id',
      foreignField: '_id',
      as: 'matched',
      pipeline: [
        {
          $project: {
            _id: 0,
            price: '$price.value',
          },
        },
      ],
    },

    replaceWith: {
      $mergeObjects: { $mergeObjects: ['$item', { $first: '$matched' }] },
    },
  });

  // format cart-item product

  return items;
});

exports.apiGetTotalOrderItemsCount = catchAsync(async (req, res) => {
  const count = await this.getTotalOrderItemsCount(req.user._id, req.query);
  return send(res, 200,"items",{ count });
});
exports.apiGetBuyAgainItems = catchAsync(async (req, res) => {
  const items = await this.getBuyAgainItems(req.user._id, req.query);
  return send(res, 200, "items", {docs: items });
});

exports.apiGetOrdersItems = catchAsync(async (req, res) => {
  console.log('reaches here')
  const items = await this.getOrdersItems(req.user._id, req.query);
  return send(res, 200,"items",{ docs: items });
});

//////////////////////////////////////////
// ORDER
//////////////////////////////////////////
exports.order = catchAsync(async (req, res, next) => {
  const { cartId } = req.params;

  const { shipping, payment, summary } = req.body;

  const cart = await shoppingCartController.getCart(cartId);

  const userId = req.user._id;

  let result;
  const orderId = new mongoose.Types.ObjectId();

  // order it
  result = await topLevelBucketController.addItemToList(
    UserActivity,
    userId,
    'orders',
    {
      items: cart.items,
      shipping,
      payment,
      summary,
    },
    {
      checkItemExist: false,
      deleteItemExist: false,
    },
    {
      update: false,
    }
  );
  if (!result) return next(new AppError('cart expired', 404));

  // commit cart
  result = await shoppingCartController.commitCart(cartId);
  if (result instanceof Error) {
    await topLevelBucketController.removeItemFromList(
      UserActivity,
      userId,
      'orders',
      orderId,
      { update: false }
    );

    return next(new AppError(result.message, 400));
  }

  // delete cart items from userActivity
  result = await userActivityCartController.removeGivenItemsFromCart(
    userId,
    cart.items.map((item) => item._id)
  );
  if (!result) {
    await userActivityCartController.removeAllCartItems(userId);
    console.error('items not removed from user cart items');
  }

  await this.saveOrderItemsSeparately(userId, cart.items, {
    totalAmount: summary.totalAmount,
    shipping: shipping,
  });

  return send(res, 200, 'order successfully');
});
