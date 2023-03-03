/* eslint-disable camelcase */
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  // user id
  _id: mongoose.Schema.Types.ObjectId,
  qty: { type: Number, default: 0 },

  reservations: [
    {
      cartId: { type: mongoose.Schema.Types.ObjectId },
      qty: { type: Number, default: 0 },
      ts: { type: Date, default: new Date() },
    },
  ],
});




InventorySchema.index({ _id: 1, 'reservations.cartId': 1, qty: 1 });

const Inventory = mongoose.model('inventory', InventorySchema);

module.exports = Inventory;
