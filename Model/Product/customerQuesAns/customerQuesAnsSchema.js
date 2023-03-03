const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  modelId:mongoose.Schema.Types.ObjectId,
  ques: String,
  ans: {
    text: String, // author details
    author: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      pic: String,
    },
    ts:Date
  },
  ts: { type: Date, default: new Date() },
  count: {
    vote: { type: Number, default: 0 },
  },

  // product details
  product: {
    _id: mongoose.Schema.Types.ObjectId,
    thumbnail: String,
    title: String,
  },
});

