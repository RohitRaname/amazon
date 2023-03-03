const mongoose = require('mongoose');
const ReviewSchema = require('./review_schema')

ReviewSchema.index({modelId:1})
const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;
