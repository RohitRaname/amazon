/* eslint-disable camelcase */
const mongoose = require('mongoose');

// cartId is same as userId
const CartSchema = new mongoose.Schema({
  // user id
  userId: mongoose.Schema.Types.ObjectId,

  state: {
    type: String,
    enum: ['active', 'pending', 'rollback', 'expired', 'retired'],
    default: 'active',
  },

  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      title: String,
      price: Number,
      thumbnail: String,
      qty: { type: Number, default: 0 },
    },
  ],

  ts: { type: Date, default: new Date() },
});

CartSchema.index({state:1,userId:1,ts:-1});
CartSchema.index({_id:1,state:1,userId:1});
CartSchema.index({_id:1,state:1,"items._id":1});

// state , userId
// id , state
// id , state , userId
// id , state , items.id



const Cart = mongoose.model('cart', CartSchema);

module.exports = Cart;
