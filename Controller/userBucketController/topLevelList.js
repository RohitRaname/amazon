/* eslint-disable camelcase */
const mongoose = require('mongoose');
const tryCatch = require('../../utils/tryCatch');
const catchAsync = require('../../utils/catchAsync');

const getNewDocPageNumber = tryCatch(async (model, userId) => {
  const doc = await model
    .findOne({
      userId,
    })
    .sort({ page: -1 })
    .limit(1)
    .exec();
  if (!doc) return 0;
  return Number(doc.page) + 1;
});

exports.updateUserDoc = tryCatch(async (userId, query) => {
  console.log({ _id: userId, ...query.filter }, { ...query.update });
  await mongoose
    .model('user')
    .findOneAndUpdate({ _id: userId, ...query.filter }, { ...query.update })
    .exec();
});

// create new doc with empty list
exports.createNewList = tryCatch(
  async (model, userId, listName, item, updateUserOptions) => {
    const newPage = await getNewDocPageNumber(model, userId);

    // create list
    const docUpdate = await model.create({
      userId: userId,
      page: newPage,

      // wishlist need name,_id

      [listName]: item,
    });

    if (updateUserOptions.update)
      this.updateUserDoc(userId, updateUserOptions.query);
    return docUpdate[listName].slice(-1)[0];
  }
);

exports.itemExistInList = tryCatch(
  async (model, userId, listName, itemId) =>
    await model
      .findOne({
        userId: userId,

        [listName]: {
          $elemMatch: { _id: itemId },
        },
      })
      .exec()
);

exports.updateItemInList = tryCatch(
  async (model, userId, listName, itemId, updateItemQuery) =>
    await model
      .findOneAndUpdate(
        { [`${listName}._id`]: itemId, userId: userId },
        updateItemQuery,
        {
          new: true,
        }
      )
      .exec()
);

// add item to bucketList
exports.addItemToList = tryCatch(
  async (
    model,
    userId,
    listName,
    item, // {_id, or maybe name also}
    queryOptions, // {limit,checkItemExist,updateIfItemExist
    updateUserOptions // {update,query}
  ) => {
    if (
      queryOptions.checkItemExist &&
      (await this.itemExistInList(model, userId, listName, item._id))
    ) {
      console.log('item exist');
      if (queryOptions.updateIfItemExist) {
        await this.updateItemInList(
          model,
          userId,
          listName,
          item._id,
          queryOptions.updateIfItemExist
        );

        if (updateUserOptions.update) {
           this.updateUserDoc(userId, updateUserOptions.query);
        }
      }

      return 'doc-exist';
    }

    if (queryOptions.deleteItem)
      await this.removeItemFromList(model, userId, 'items', item._id, false);

    const filterQuery = {
      userId: userId,
      $expr: {
        $lt: [
          { $size: `$${listName}` },
          queryOptions.limit === 'infinite' ? 10000000 : '$limit',
        ],
      },
    };

    const docUpdate = await model
      .findOneAndUpdate(
        filterQuery,
        {
          $push: { [listName]: item },
        },
        { new: true }
      )
      .exec();

    if (docUpdate) {
      const docInserted = docUpdate[listName].slice(-1)[0];
      if (updateUserOptions.update) {
         this.updateUserDoc(userId, updateUserOptions.query);
      }

      return docInserted;
    }

    // if list is full then new create new doc
    return await this.createNewList(
      model,
      userId,
      listName,
      item,
      updateUserOptions
    );
  }
);

exports.addItemsToList = tryCatch(
  async (
    model,
    userId,
    listName,
    items, // {_id, or maybe name also}
    queryOptions,
    updateUserOptions // {limit,checkItemExist,updateIfItemExist))
  ) => {
    const promises = items.map((item) =>
      this.addItemToList(
        model,
        userId,
        listName,
        item,
        queryOptions,
        updateUserOptions
      )
    );
    await Promise.all(promises);
  }
);

// remove one from list
exports.removeItemFromList = tryCatch(
  async (
    model,
    userId,
    listName,
    itemId, // {_id:item._id}
    updateUserOptions // {update,query}
  ) => {
    const docUpdate = await model
      .findOneAndUpdate(
        {
          userId: userId,
          [`${listName}._id`]: itemId,
        },
        {
          $pull: { [listName]: { _id: itemId } },
        },
        { new: true }
      )
      .exec();

    if (!docUpdate) return 'item-not-exist';

    if (docUpdate) {
      if (updateUserOptions.update)
        this.updateUserDoc(userId, updateUserOptions.query);

      return docUpdate[listName].slice(-1)[0];
    }
  }
);

// remove all items from all list
exports.removeAllItems = tryCatch(
  async (
    model,
    userId,
    listName,
    updateUserOptions // {update,query}
  ) => {
    const docUpdate = await model
      .updateMany(
        {
          userId: userId,
          [listName]: { $gt: [] },
        },
        {
          $set: { [listName]: [] },
        },
        { new: true }
      )
      .exec();

    if (!docUpdate) return 'item-not-exist';

    if (docUpdate) {
      if (updateUserOptions.update)
        this.updateUserDoc(userId, updateUserOptions.query);
    }

    return true;
  }
);
exports.removeGivenItems = tryCatch(
  async (model, userId, listName, itemIds) => {
    await model
      .updateMany(
        {
          userId: userId,
          [listName]: { $gt: [] },
        },
        {
          $pull: { [listName]: { _id: { $in: itemIds } } },
        },
        { new: true }
      )
      .exec();

    return true;
  }
);

// COUNT ----------------------------------------------
exports.getTotalItemsCount = tryCatch(async (model, userId, query) => {
  const { listName, filter } = query;

  let pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...((filter && filter.list) || {}),
      },
    },

    { $unwind: `$${listName}` },

    { $replaceWith: `$${listName}` },

    filter && filter.item
      ? {
          $match: filter.item,
        }
      : null,

    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },

    { $unset: '_id' },
  ];

  pipeline = pipeline.filter((el) => el);
  console.log(pipeline);
  //
  const list = await model.aggregate(pipeline).exec();

  return list.length === 0 ? 0 : list[0]['count'];
});

exports.getTotalPage = tryCatch(async (model, userId) => {
  const doc = await model
    .findOne({
      userId,
    })
    .sort({ page: -1 })
    .limit(1)
    .exec();
  if (!doc) return 0;
  return Number(doc.page);
});

// Filter Items ----------------------------------------
exports.getEmbeddedItems = tryCatch(async (model, userId, query) => {
  const {
    listName,
    match,
    sort,
    page,
    limit,
    skip,
    project,
    directContainItems,
    filter,
  } = query;

  let pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...match,
      },
    },

    { $unwind: `$${listName}` },

    !directContainItems
      ? { $replaceWith: '$items' }
      : { $replaceWith: `$${listName}` },

    filter && filter.item ? { $match: filter.item } : null,

    sort ? { $sort: { ts: sort.includes('-') ? -1 : 1 } } : null,

    { $skip: Number(skip) || 0 },

    { $limit: Number(limit) || 10 },

    project
      ? {
          $project: project,
        }
      : null,
  ];

  pipeline = pipeline.filter((el) => el);
  console.log(pipeline);

  const items = await model.aggregate(pipeline).exec();

  return items;
});

exports.getRefItems = tryCatch(async (model, userId, query) => {
  const {
    listName,
    sort,
    page,
    limit,
    skip,
    project,
    directContainItems,
    lookup,
    replaceWith,
    set,
    unset,
  } = query;

  let pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        page: Number(page) || 0,
      },
    },

    { $unwind: `$${listName}` },

    !directContainItems
      ? { $replaceWith: '$items' }
      : { $replaceWith: `$${listName}` },

    sort ? { $sort: { ts: sort.includes('-') ? -1 : 1 } } : null,

    { $skip: Number(skip) || 0 },

    { $limit: Number(limit) || 10 },

    {
      $lookup: lookup || {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'match',
      },
    },

    {
      $replaceWith: replaceWith || {
        $mergeObjects: ['$$ROOT', { $first: '$match' }],
      },
    },

    set ? { $set: set } : null,
    unset ? { $unset: unset } : null,

    project ? { $project: project } : null,
  ];

  pipeline = pipeline.filter((el) => el);

  const items = await model.aggregate(pipeline).exec();

  return items;
});

// ALL ITEMS
exports.getAllEmbeddedItems = tryCatch(async (model, userId, query) => {
  const { listName, sort, project, directContainItems } = query;

  let pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    { $unwind: `$${listName}` },

    !directContainItems
      ? { $replaceWith: '$items' }
      : { $replaceWith: `$${listName}` },

    sort
      ? {
          $sort: {
            [sort.includes('-') ? sort.slice(1) : sort]: sort.includes('-')
              ? -1
              : 1,
          },
        }
      : null,

    project ? { $project: project } : null,
  ];

  pipeline = pipeline.filter((el) => el);

  const items = await model.aggregate(pipeline).exec();

  return items;
});
exports.getRefAllItems = tryCatch(async (model, userId, query) => {
  const {
    listName,
    sort,

    project,
    directContainItems,
    lookup,
    replaceWith,
    unset,
  } = query;

  let pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    { $unwind: `$${listName}` },

    !directContainItems
      ? { $replaceWith: '$items' }
      : { $replaceWith: `$${listName}` },

    sort ? { $sort: { ts: sort.includes('-') ? -1 : 1 } } : null,

    {
      $lookup: lookup || {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'match',
      },
    },

    {
      $replaceWith: replaceWith || {
        $mergeObjects: ['$$ROOT', { $first: '$match' }],
      },
    },

    unset ? { $unset: unset } : null,

    project ? { $project: project } : null,
  ];

  pipeline = pipeline.filter((el) => el);

  const items = await model.aggregate(pipeline).exec();

  return items;
});
