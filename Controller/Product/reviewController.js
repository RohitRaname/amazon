const sharp = require('sharp');
const mongoose = require('mongoose');
const Factory = require('../handleFactoryController');
const catchAsync = require('../../utils/catchAsync');
const { formatQueryIntoPipeline } = require('../../utils/mongodbQueryConverter');
const tryCatch = require('../../utils/tryCatch');
const Product = require('../../Model/Product/product_model');
const User = require('../../Model/user/userModel');
const UserActivity = require('../../Model/user/userActivityModel');
const Review = require('../../Model/review/review_model');
const send = require('../../utils/sendJSON');
const multerFile = require('../../utils/multer');
const AppError= require('../../utils/AppError')
const topLevelBucketController = require('../userBucketController/topLevelList');

// ques has answer property in it
exports.resizePhotos = async (req, res, next) => {
  if (!req.files) return next();

  const photos = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const file of req.files) {
    const filename = `review-${req.user._id}-${Date.now()}.jpeg`;

    // done after some time
    sharp(file.buffer)
      .resize({ width: 1280 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/reviews/${filename}`);

    photos.push(filename);
  }

  req.body.content_photos = photos;

  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const { modelId } = req.params;

  req.body = multerFile.convertFormDataIntoObj(req.body);

  req.body._id = new mongoose.Types.ObjectId();

  const { photos } = req.body.content;

  const result = await Promise.all([
    Review.create(req.body),
    photos && photos.length
      ? Product.updateMany(
          { 'modelId._id': modelId },
          {
            $inc: { 'count.reviews': 1 },
            $push: {
              reviews: {
                $each: [req.body],
                $position: 0,
                $slice: 8,
              },
              reviews_with_photos: {
                $each: [req.body],
                $position: 0,
                $slice: 8,
              },
            },
          },
          {
            new: true,
          }
        ).exec()
      : Product.updateMany(
          { 'modelId._id': modelId },
          {
            $inc: { 'count.reviews': 1, 'count.photoReviews': 1 },
            $push: {
              reviews: {
                $each: [req.body],
                $position: 0,
                $slice: 8,
              },
            },
          },
          {
            new: true,
          }
        ).exec(),
    topLevelBucketController.addItemToList(
      UserActivity,
      req.user._id,
      'reviews',
      {
        content: req.body.content,
        item: req.body.product._id,
        rating: req.body.rating,
        count: req.body.count,
        ts: new Date(),
      },
      {
        checkItemExist: false,
        deleteItemExist: false,
      },
      {
        update: true,
        query: {
          filter: {},
          update: {
            $push: {
              reviews: {
                $each: [
                  {
                    _id: req.body._id,
                    content: req.body.content,
                    item: req.body.product._id,
                    rating: req.body.rating,
                    count: req.body.count,
                    ts: new Date(),
                  },
                ],
                $position: 0,
                $slice: 10,
              },
            },
            $inc: { 'count.reviews': 1 },
          },
        },
      }
    ),
  ]);
  return send(res, 200, 'ques created', result);
});

const getReviewSearchBasicPipeline = (
  modelId,
  query,
  getTotalDocsCount = false
) => {
  let pipeline = [
    {
      $search: {
        compound: {
          must: [
            {
              equals: {
                path: 'modelId',
                value: new mongoose.Types.ObjectId(modelId),
              },
            },
          ],
          should: [
            {
              autocomplete: {
                path: 'content.title',
                query: query.q,
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1,
                  maxExpansions: 256,
                },

                score: { boost: { value: 2 } },
              },
            },
            {
              autocomplete: {
                path: 'content.text',
                query: query.q,
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1,
                  maxExpansions: 256,
                },
              },
            },
          ],
          minimumShouldMatch: 1,
        },
        highlight: { path: ['content.title', 'content.text'] },
      },
    },
  ];

  pipeline = formatQueryIntoPipeline(query, pipeline);

  // get total docs count
  if (getTotalDocsCount) {
    pipeline.push({ $count: 'count' });
    pipeline.push({ $project: { count: 1 } });
    return pipeline;
  }

  // get limit docs
  // pipeline.push({ $limit: Number(query.limit) });
  pipeline.push({ $set: { highlights: { $meta: 'searchHighlights' } } });

  return pipeline;
};

exports.getSearchReviewsTotalCount = catchAsync(async (req, res, next) => {
  const pipeline = getReviewSearchBasicPipeline(
    req.params.modelId,
    req.query,
    true
  );

  const agg = await Review.aggregate(pipeline);

  return send(res, 200, 'reviews', {
    count: agg.length === 0 ? 0 : agg[0].count,
  });
});

exports.searchReviews = catchAsync(async (req, res, next) => {
  const pipeline = getReviewSearchBasicPipeline(req.params.modelId, req.query);

  const agg = await Review.aggregate(pipeline);

  return send(res, 200, 'reviews', { docs: agg });
});

// helpfulreview count
exports.updateReviewCountField = catchAsync(async (req, res, next) => {
  const { id, modelId, action } = req.params;

  const { field } = req.query;

  const userId= req.user._id

  if (field === 'helpful') {
    const quesAlreadyVoteByUser =
      await topLevelBucketController.itemExistInList(
        UserActivity,
        userId,
        'reviewHelpful',
        id
      );

    if (quesAlreadyVoteByUser) return next(new AppError('item exist', 400));
  }

  console.log(req.params,req.query)

  const result = await Promise.all([
    Review.updateOne(
      { _id: id },
      {
        $inc: { [`count.${field}`]: action === 'increase' ? 1 : -1 },
      }
    ).exec(),
    topLevelBucketController.addItemToList(
      UserActivity,
      userId,
      'reviewHelpful',
      { _id: id },
      {
        checkItemExist: false,
        deleteItemExist: false,
      },
      {
        update: false,
      }
    ),
    Product.updateMany(
      { 'modelId._id': modelId },
      {
        $inc: {
          [`reviews.$[el].count.${field}`]: action === 'increase' ? 1 : -1,
          [`reviews_with_photos.$[el].count.${field}`]:
            action === 'increase' ? 1 : -1,
        },
      },
      {
        arrayFilters: [{ 'el._id': id }],
        new: true,
      }
    ).exec(),
    User.updateOne(
      { _id: req.user._id },
      {
        $inc: { [`count.${field}`]: action === 'increase' ? 1 : -1 },
      }
    ),
  ]);
  return send(res, 200, 'ques created', result);
});

exports.deleteModelAllVariantReviews = catchAsync(async (req, res, next) => {
  const { modelId } = req.params;

  const result = await Promise.all([
    Review.deleteMany({ modelId: modelId }),

    Product.updateMany(
      { 'modelId._id': modelId },
      {
        $set: {
          reviews: [],
          reviews_with_photos: [],
        },
      },
      {
        new: true,
      }
    ).exec(),
  ]);
  return send(res, 200, 'ques created', result);
});

exports.getAll = Factory.getAll(Review);
exports.getAllDocsCount = Factory.getAllDocsCount(Review);
exports.getOne = Factory.getOne(Review);

// ADMIN
exports.updateOne = Factory.updateOne(Review);
exports.updateAll = Factory.updateAll(Review);
exports.deleteOne = Factory.deleteOne(Review);
exports.deleteAll = Factory.deleteAll(Review);
exports.createOne = Factory.createOne(Review);
