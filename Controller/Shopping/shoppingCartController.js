const catchAsync = require('../../utils/catchAsync');
const tryCatch = require('../../utils/tryCatch');
const send = require('../../utils/sendJSON');
const Cart = require('../../Model/Shopping/cartModel');
const AppError = require('../../utils/AppError');
const userActivityCartItemsController = require('../User/cartItemsController');
const inventoryController = require('./inventoryController');

// check if there is 30mins of inactivity in cart
const checkCartValid = (ts) =>
  new Date( new Date().setMinutes(new Date(ts).getMinutes() + 30)) > new Date();

const checkCartValidQuery = () => ({
  ts: { $gt: new Date(new Date().setMinutes(-30)) },
});

exports.expireCart = tryCatch(async (cartId) => {
  let result;
  // expired
  result = await Cart.findOneAndUpdate({ _id: cartId }, { state: 'expired' });
  if (!result) return console.error(`cart ${cartId} not expired`);

  // expired
  result = await Cart.findOneAndDelete({ _id: cartId });
  if (!result) return console.error(`cart ${cartId} not deleted`);
});

exports.getCart = tryCatch(
  async (cartId) => await Cart.findOne({ _id: cartId }).exec()
);

exports.getRecentCreatedCart = tryCatch(
  async (userId) =>
    await Cart.findOne({ state:"pending", userId: userId }).sort({ ts: -1 }).exec()
);

exports.deleteCart = tryCatch(
  async (cartId) => await Cart.findOneAndDelete({ _id: cartId })
);

const rollback = tryCatch(async (cartId, items) => {
  // setting state to rollback
  let result = await Cart.findOneAndUpdate(
    { _id: cartId },
    { $set: { state: 'rollback' } },
    { new: true }
  );

  if (!result) return console.error(`cart ${cartId} not rollback`);

  // unreserve the items
  result = await inventoryController.unreserveItems(cartId, items);
  if (!result) return console.error(`cart ${cartId} items not unreserved`);

  await this.expireCart(cartId);
});

const retireCart = tryCatch(async (cartId) => {
  let result = await Cart.findOneAndUpdate(
    { _id: cartId, state: 'commit' },
    { $set: { state: 'retired' } }
  );
  if (!result) return new Error(`cart ${cartId} not retired`);

  // setting state to rollback
  result = await Cart.findOneAndDelete({ _id: cartId });
  if (!result) return new Error(`cart ${cartId} not deleted`);

  return true;
});

exports.commitCart = tryCatch(async (cartId) => {
  console.log('cart-id',cartId)
  const cart = await Cart.findOne({ _id: cartId, state: 'pending' }).exec();
  if (!cart) return new Error('cart expired');
  const { ts, items } = cart;

  console.log('cart-ts', ts, checkCartValid(ts));

  if (!checkCartValid(ts)) {
    await rollback(cartId, items);
    return new Error('cart expired');
  }
  let result;

  result = await inventoryController.freeReserveItems(cartId, items);
  if (!result) {
    await inventoryController.freeReserveItems(cartId, items);
  }

  result = await Cart.findOneAndUpdate(
    { _id: cartId, state: 'pending' },
    { $set: { state: 'commit', ts: new Date() } },
    { new: true }
  );

  if (!result) return rollback(cartId, items);

  return retireCart(cartId);
});

exports.checkout = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // add use cart item to cart
  let { items } = req.body;
  console.log(items);

  if (!items) {
    items = await userActivityCartItemsController.getCartItems(
      userId,
      req.user.currency
    );

    items = items.map((el) => ({
      _id: el._id,
      qty: el.qty,
      title: el.title,
      price: el.price.value,
      thumbnail: el.thumbnail,
    }));

    console.log(items);
  }

  // create cart
  const cart = await Cart.create({
    state: 'active',
    userId: userId,
    ts: new Date(),
    items: items,
  });
  if (!cart) return new AppError('Cart not created', 500);

  console.log('cart', cart);

  const cartId = cart._id;

  // reserve items
  let result = await inventoryController.reserveItems(cartId, items);
  if (result instanceof Error) return next(result.error);

  // change state from active ---> pending
  result = await Cart.findOneAndUpdate(
    { _id:cartId, state: 'active', userId: userId },
    {
      $set: {
        state: 'pending',
        ts: new Date(),
      },
    }
  );
  if (!result) {
    rollback(cartId, items);
    return new AppError('cart not found', 500);
  }

  return send(res, 200, 'add item to cart', { cartId: cartId });
});

// item related

// 1.update cart item qty
exports.updateShoppingCartItemQty = catchAsync(async (req, res, next) => {
  const cartId = req.params.id;

  const item = req.body;
  let { delta, newQty } = item;

  delta = Number(delta);
  newQty = Number(newQty);

  let result;
  // {newQty,delta}

  // update cart item
  result = await Cart.findOneAndUpdate(
    { _id: cartId,state: 'pending' , 'items._id': item._id, },
    {
      $set: {
        'items.$.qty': newQty,
        ts: new Date(),
      },
    }
  );

  if (!result) return next(new AppError('cart expired', 400));

  if (!checkCartValid(result.ts)) {
    await rollback(req.user._id, result._id, result.items);
    return next(new AppError('cart expired', 400));
  }

  // update inventory qty
  result = await inventoryController.updateInventoryItemQty(
    cartId,
    item._id,
    delta
  );
  if (!result) {
    await Cart.findOneAndUpdate(
      { _id: cartId, 'items._id': item._id, state: 'pending' },
      {
        $inc: {
          'items.$.qty': newQty - delta,
        },
      }
    );
    return next(new AppError('insufficient inventory', 500));
  }

  return send(res, 200, 'item qty updated');
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const { id: cartId, itemId, qty } = req.params;

  console.log(cartId, itemId, qty);

  let result;

  // update cart item
  result = await Cart.findOneAndUpdate(
    { _id: cartId, 'items._id': itemId, state: 'pending' },
    {
      $pull: {
        items: { _id: itemId },
      },

      $set: {
        ts: new Date(),
      },
    }
  );
  if (!result)
    return next(new AppError('Item not removed! Please try again', 500));

  if (!checkCartValid(result.ts)) {
    await rollback(req.user._id, result._id, result.items);
    return next(new AppError('cart expired', 400));
  }

  // update inventory
  result = await inventoryController.unreserveItems(cartId, [
    { _id: itemId, qty: Number(qty) },
  ]);
  if (!result) {
    await inventoryController.unreserveItems(cartId, [
      { _id: itemId, qty: qty },
    ]);
    return next(new AppError('error occur during deleting item', 500));
  }

  return send(res, 200, 'item removed from cart');
});

// 2.remove cart item

exports.apiRollbackCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.params.id }).exec();

  const result = await rollback(cart._id, cart.items);

  if (result instanceof Error) return next(new AppError(result), 500);

  return send(res, 200, 'cart rollback', result);
});
exports.apiRetireCart = catchAsync(async (req, res, next) => {
  const result = await retireCart(req.params.id);

  if (result instanceof Error) return next(new AppError(result), 500);

  return send(res, 200, 'cart retired', result);
});
exports.apiCommitCart = catchAsync(async (req, res, next) => {
  const result = await this.commitCart(req.params.id);

  if (result instanceof Error) return next(new AppError(result), 500);

  return send(res, 200, 'cart retired', result);
});

exports.cleanupCartController = (maxTimeMS = 30 * 60 * 60 * 1000) => {
  setTimeout(async () => {
    const carts = await Cart.find({}).exec();

    const promises = [];

    carts.forEach((cart) => {
      const { state, ts, _id: cartId, items } = cart;

      let promise;

      if (state === 'active' && !checkCartValid(ts))
        promise = this.expireCart(cartId);
      else if (state === 'pending' && !checkCartValid(ts))
        promise = rollback(cartId, items);
      else if (state === 'rollback') promise = rollback(cartId, items);
      else if (state === 'commit') promise = retireCart(cartId, items);
      else if (state === 'retired') promise = this.deleteCart(cartId);

      promises.push(promise);
    });

    await Promise.all(promises);
  }, 0);
};

this.cleanupCartController();
