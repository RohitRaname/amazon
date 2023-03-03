/* eslint-disable camelcase */
const mongoose = require('mongoose');

// group by user to limit data loaded when search by user
// 1000 -> 50

const HistorySchema = new mongoose.Schema({
  // user id
  userId: mongoose.Schema.Types.ObjectId,
  page: Number,
  limit: { type: Number, default: 100 },

  items: [{ _id: mongoose.Schema.Types.ObjectId,title:String, thumbnail: String,ts:{type:Date,default:new Date()} }],
  ts: { type: Date, default: new Date() },
});

HistorySchema.index({userId:1,page:1});
HistorySchema.index({userId:1,"items._id":1});

const History = mongoose.model('history', HistorySchema);

module.exports = History;
