/* eslint-disable camelcase */
const express = require('express');

const reviewController = require('../../Controller/Product/reviewController');
const multerFile = require('../../utils/multer');
const { protect, sendJwtIfNeeded } = require('../../Controller/jwtController');

const Router = express.Router({ mergeParams: true });

 
Router.route('/')
  .post(
    protect,
    sendJwtIfNeeded(true),
    multerFile.singleFieldMultiplePhotos('content_photos', 4),
    reviewController.resizePhotos,
    reviewController.createReview
  )
  .delete(reviewController.deleteModelAllVariantReviews)
  .get(reviewController.getAll);
 
Router.get('/count', reviewController.getAllDocsCount);

Router.patch(
  '/:id/count/:action',
  protect,
  sendJwtIfNeeded(true),
  reviewController.updateReviewCountField
);
Router.get('/search', reviewController.searchReviews);
Router.get('/search/count', reviewController.getSearchReviewsTotalCount);


Router.route('/admin')
  .get(reviewController.getAll)
  .post(reviewController.createOne)
  .delete(reviewController.deleteAll)
  .patch(reviewController.updateAll);

Router.route('/admin/:id')
  .get(reviewController.getOne)
  .patch(reviewController.updateOne)
  .delete(reviewController.deleteOne);
module.exports = Router;
