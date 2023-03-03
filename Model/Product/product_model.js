const mongoose = require('mongoose');

const ReviewSchema = require('../review/review_schema');
const customerQuesAnsSchema = require('./customerQuesAns/customerQuesAnsSchema');


// product > model > variants
// iphone 14 > iphone 14 max > [color,size]

const ProductSchema = new mongoose.Schema({

  model: {
    isModel: { type: Boolean, default: false },
    _id: mongoose.Schema.Types.ObjectId,
    variantId: mongoose.Schema.Types.ObjectId,
  },

  title: { type: String, required: true },
  name: { type: String, required: true },
  price: { unit: { type: String, default: '$' }, value:Number},
  discount: { type: Number, default: 0 },
  category: String,
  stock: { type: Number, default: 1000 },

  assets: {
    thumbnail: String,
    product_imgs: [String],
    product_spec_imgs: [String],
  },

  attributes: [{ name: String, value: String }],

  description: [String],

  specs: [{ name: String, value: String }],

  curVariant: {
    color: {
      name: String,
      color_img: String,
    },
    size: String,
  },

  variants: {
    colors: [
      {
        variant_id: mongoose.Schema.Types.ObjectId,
        color: String,
        color_img: String,
      },
    ],
    sizes: [
      {
        variant_id: mongoose.Schema.Types.ObjectId,
        value: String,
      },
    ],
  },

  created_at: { type: Date, default: new Date() },
  updated_at: Date,

  active: { type: Boolean, default: true },

  // PROPERTIES UPDATED WHEN OTHER VARIANTS UPDATED ----------------

  // max 10 reviews
  // 1.review with or without img
  reviews: [ReviewSchema],

  // 2.review with only images max 8
  reviews_with_photos: [ReviewSchema],

  // max 15 questions
  customerQuesAns: [customerQuesAnsSchema],

  rating: {
    value: { type: Number, default: 0 },
    count: { type: Number, default: 0 },

    count_by_star: {
      one_star: { type: Number, default: 0 },
      two_star: { type: Number, default: 0 },
      three_star: { type: Number, default: 0 },
      four_star: { type: Number, default: 0 },
      five_star: { type: Number, default: 0 },
    },
  },

  count: {
    ques: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    photoReviews:{ type: Number, default: 0 }

  },
});

ProductSchema.index({ "model._id":1 });
ProductSchema.index({ _id:1,stock:1 });

ProductSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
