/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const catchAsync = require('../../utils/catchAsync');
const send = require('../../utils/sendJSON');
const Inventory = require('../../Model/Shopping/inventoryModel');
const tryCatch = require('../../utils/tryCatch');
const Product = require('../../Model/Product/product_model');

exports.createInventory = catchAsync(async (req, res) => {
  const allPRoductsId = await Product.find({}, { _id: 1 });

  await Inventory.deleteMany({});

  for (const product of allPRoductsId)
    await Inventory.create({ _id: product._id, qty: 1000 });

  return send(res, 200, 'inventory created');
});

exports.getItemInventory = tryCatch(
  async (itemId) =>
    await Inventory.find({ _id: itemId }, { qty: 1, _id: 0 }).exec()
);

exports.reserveItems = tryCatch(async (cartId, items) => {
  const success = [];
  const failure = [];

  //   reserve items
  for (const item of items) {
    const [result,updateProduct] = await Promise.all([
      Inventory.findOneAndUpdate(
        { _id: item._id, qty: { $gte: item.qty } },
        {
          $inc: { qty: -item.qty },
          $push: {
            reservations: {
              cartId,
              qty: item.qty,
              ts: new Date(),
            },
          },
        },
        { new: true }
      ),
      Product.findOneAndUpdate({ _id: item._id, stock: { $gte: item.qty } },{
        $inc:{ stock: -item.qty },
      }),
    ]);

    result ? success.push(item) : failure.push(item);
  }

  // if reserve all will reserve now some are reserved and some not , now e now undo the change
  if (failure.length > 0) {
    await Promise.all(
      ...success.map((item) =>
        Inventory.findOneAndUpdate(
          { _id: item._id },
          {
            $inc: { qty: item.qty },
            $pull: {
              reservations: {
                cartId:cartId,
            
              },
            },
          },
          { new: true }
        )
      ),
     ...success.map((item) =>
      Product.findOneAndUpdate(
        { _id: item._id },
        {
          $inc: { stock: item.qty },
         
        },
        { new: true }
      )
    )
    );

    return new Error('item reservation unsuccessful', 500);
  }

  return true;

  // const reserve= await
});

exports.unreserveItems = tryCatch(async (cartId, items) => {
  const success = [];
  const failure = [];

  //   reserve items
  for (const item of items) {
    const [result,updateProduct] = await Promise.all([
      Inventory.findOneAndUpdate(
      { _id: item._id, 'reservations.cartId': cartId },
      {
        $inc: { qty: item.qty },
        $pull: {
          reservations: {
            cartId: cartId,
          },
        },
      },
      { new: true }
    ),
     Product.findOneAndUpdate({ _id: item._id },{
      $inc:{ stock: item.qty },
    })
  ])

    result ? success.push(item) : failure.push(item);
  }

  if (failure.length > 0) {
    await Promise.all(
      ...success.map((item) =>
        Inventory.findOneAndUpdate(
          { _id: item._id, 'reservations.cartId': cartId },
          {
            $inc: { qty: -item.qty },
            $push: {
              reservations: {
                cartId: cartId,
                qty:item.qty,
                ts:new Date()
              },
            },
          },
          { new: true }
        )
      ),
      ...success.map((item) =>
      Product.findOneAndUpdate(
        { _id: item._id, },
        {
          $inc: { stock: -item.qty },
              },
        { new: true }
      )
    )
    );
  }

  return true;
});

// remove item from reservation on successfull order
exports.freeReserveItems = tryCatch(async (cartId, items) => {
  const success = [];
  const failure = [];

  //
  for (const item of items) {
    const result = await Inventory.findOneAndUpdate(
      { _id: item._id, 'reservations.cartId': cartId },
      {
        $pull: {
          reservations: {
            cartId: cartId,
          },
        },
      },
      { new: true }
    );

    result ? success.push(item) : failure.push(item);
  }

  if (failure.length > 0) {
    await Promise.all(
      success.map((item) =>
        Inventory.findOneAndUpdate(
          { _id: item._id, 'reservations.cartId': cartId },
          {
            $push: {
              reservations: { cartId: cartId,qty:item.qty,ts:new Date() },
            },
          },
          { new: true }
        )
      )
    );

    return new Error('Free reservation unsuccessful');
  }
  return true;
});

// qty Delta can be positive or negative
exports.updateInventoryItemQty = tryCatch(async (cartId, itemId, delta) => {
  const [result,updateProduct] = await Promise.all([
     Inventory.findOneAndUpdate(
    {
      _id: itemId,
      'reservations.cartId': cartId,
      $expr: {
        $gte: [{ $add: ['$qty', delta] }, 0],
      },
    },
    {
      $inc: {
        qty: delta,
        'reservations.$.qty': delta,
      },
    },
    { new: true }
  ),Product.findOneAndUpdate(
    {
      _id: itemId,
    
      $expr: {
        $gte: [{ $add: ['$stock', delta] }, 0],
      },
    },
    {
      $inc: {
        stock: delta,
      },
    },
    { new: true }
  )]);

  if (!result) return new Error('insufficient inventory');

  return true;
});
