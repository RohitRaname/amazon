/* eslint-disable camelcase */
const mongoose = require('mongoose');

// group by user to limit data loaded when search by user
// 1000 -> 50

const UserActivitySchema = new mongoose.Schema({
  // user id
  userId: mongoose.Schema.Types.ObjectId,

  page: { type: Number, default: 0 },

  // this limit if for top level items => review,wishlists
  limit: { type: Number, default: 50 },

  // one wishlist max contains 25 items then new doc is created
  wishlists: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,

      // this limit is for nested items
      limit: { type: Number, default: 50 },
      // max 50 items
      items: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          purchased: { type: Boolean, default: false },
          private: { type: Boolean, default: true },
          ts: { type: Date, default: new Date() },
        },
      ],
    },
  ],

  quesVoted: [{ _id: mongoose.Schema.Types.ObjectId }],

  // review helpful votes
  reviewHelpful: [{ _id: mongoose.Schema.Types.ObjectId }],

  reviews: [
    {
      content: {
        title: String,
        text: String,
      },
      item: mongoose.Schema.Types.ObjectId,
      count: {
        helpful: { type: Number, default: 0 },
      },
      rating: { type: Number, default: 0 },
      ts: { type: Date, default: new Date() },
    },
  ],

  following: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      pic: { type: String, default: 'default.png' },
    },
  ],

  // cart items stored by user so user can buy them no checkout unless user does the checkout
  cart: [
    {
      // itemId
      _id: { type: mongoose.Schema.Types.ObjectId },
      qty: { type: Number, default: 0 },
      ts: { type: Date, default: new Date() },
    },
  ],

  orders: [
    {
      items: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          title: String,
          price: Number,
          thumbnail: String,
        },
      ],

      shipping: {
        name: String,
        address: String,
      },

      payment: {
        method: String,
      },

      summary: {
        totalAmount: Number,
      },
      ts: { type: String, default: new Date() },
    },
  ],
  orderItems: [
    {
      item: {
        _id: mongoose.Schema.Types.ObjectId,
        thumbnail: String,
        title: String,
        price: Number,
      },
      summary: {
        totalAmount: Number,
        shipping: {
          name: String,
          address: String,
        },
      },
      ts: { type: Date, default: new Date() },
    },
  ],
  // this will be fast to fill so no need it to be here
});

UserActivitySchema.index({ userId: 1, page: 1 });

UserActivitySchema.index({ userId: 1, 'wishlists._id': 1 });
UserActivitySchema.index({ userId: 1, 'quesVoted._id': 1 });
UserActivitySchema.index({ userId: 1, 'reviewHelpful._id': 1 });
UserActivitySchema.index({ userId: 1, 'reviews._id': 1 });
UserActivitySchema.index({ userId: 1, 'following._id': 1 });
UserActivitySchema.index({ userId: 1, 'cart._id': 1 });
UserActivitySchema.index({ userId: 1, 'orders._id': 1 });
UserActivitySchema.index({ userId: 1, 'orderItems._id': 1 });

const UserActivity = mongoose.model('userActivity', UserActivitySchema);

module.exports = UserActivity;
