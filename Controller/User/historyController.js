const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const send = require('../../utils/sendJSON');
const Factory = require('../handleFactoryController');
const History = require('../../Model/historyModel');
const topLevelBucketController = require('../userBucketController/topLevelList');
const tryCatch = require('../../utils/tryCatch');

exports.saveHistory = tryCatch(async (userId, product) => {
  await topLevelBucketController.addItemToList(
    History,
    userId,
    'items',
    product,
    {
      checkItemExist: false,
      deleteItemExist: true,
    },
    {
      update: true,
      query: {
        filter: { 'history._id': { $ne: product._id } },

        update: {
          $push: {
            history: { $each: [product], $slice: 4, $position: 0 },
          },
        },
      },
    }
  );
});

// delete item from history
exports.deleteOne = tryCatch(async (userId, itemId) => {
  await topLevelBucketController.removeItemFromList(
    History,
    userId,
    'items',
    itemId,
    {
      update: true,
      query: {
        filter: { 'history._id': itemId },

        update: {
          $pull: {
            history: { _id: itemId },
          },
        },
      },
    }
  );
});

exports.getItems = tryCatch(async (userId, query) => {
  const { page, limit, skip, sort, exclude } = query;
  return await topLevelBucketController.getRefItems(History, userId, {
    listName: 'items',
    sort,
    page,
    limit,
    skip,
    project: {
      thumbnail: 1,
      'rating.count': 1,
      'rating.value': 1,
      title: 1,
    },
  });
});
exports.getTotalPage = tryCatch(
  async (userId) => await topLevelBucketController.getTotalPage(History, userId)
);

//////////////////////////////////////////////////////////////////
// -- API
//////////////////////////////////////////////////////////////////
exports.apiGetHistoryItemsCount = catchAsync(async (req, res) => {
  const count = await topLevelBucketController.getTotalItemsCount(
    History,
    req.user._id,
    {
      listName: 'items',
      filter: {
        list: { items: { $gt: [] } },
      },
    }
  );
  return send(res, 200, 'items-count', { count });
});

exports.apiSaveHistory = catchAsync(async (req, res, next) => {
  await this.saveHistory(req.user._id, req.body.product);

  // add wishlist with item to user

  return send(res, 200, 'history-saved');
});

exports.apiGetHistory = catchAsync(async (req, res, next) => {
  const history = await this.getItems(req.user._id, req.query);
  return send(res, 200, 'docs', { docs: history });
});

exports.apiDeleteOne = catchAsync(async (req, res, next) => {
  const history = await this.deleteOne(req.user._id, req.params.id);
  return send(res, 200, 'docs', { docs: history });
});
exports.apiDeleteAll = catchAsync(async (req, res, next) => {
  const history = await topLevelBucketController.removeAllItems(
    History,
    req.user._id,
    'items',
    {
      update: true,
      query: {
        filter: {},
        update: {
          $set: {
            history: [],
          },
        },
      },
    }
  );
  return send(res, 200, 'docs', { docs: history });
});
