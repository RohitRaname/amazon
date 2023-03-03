const mongoose = require('mongoose');
  
module.exports = new mongoose.Schema({
  // groupby field
  modelId: mongoose.Schema.Types.ObjectId,
  
  author: {
    _id: mongoose.Schema.Types.ObjectId,
    pic: String,
    name: String,
    country: String,
  },
  content: {
    title: String,
    text: String,
    photos: [String],
  },
  product: {
    _id: mongoose.Schema.Types.ObjectId,
    color: String,
    size: String,
  },

  
  count: {
    helpful: { type: Number, default: 0 },
  },
  rating: { type: Number, default: 0 },
  ts: { type: Date, default: new Date() },
});
