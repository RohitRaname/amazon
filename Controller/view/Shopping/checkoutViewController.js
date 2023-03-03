/* eslint-disable camelcase */
const catchAsync = require('../../../utils/catchAsync');
const shoppingCartController = require('../../Shopping/shoppingCartController');

exports.renderCheckoutPage = catchAsync(async (req, res) => {
  const user = req.user;

  // create cart with selected items
  const cart = await shoppingCartController.getRecentCreatedCart(req.user._id);
  if (
    !cart ||
    ['rollback', 'expired'].find((state) => cart.state === state) ||
    new Date(cart.ts) <
      new Date(new Date().setMinutes(new Date().getMinutes() - 30))
  )
    return res.redirect('/me/cart');

  console.log(
    ['rollback', 'expired'].find((state) => cart.state === state),
    new Date(cart.ts) < new Date(new Date().setMinutes(-30)),
    !cart
  );

  console.log('cart', cart);

  // add converted price
  cart.items.forEach(
    (item) =>
      (item.convertPrice = `${user.currency.symbol}${(
        Number(user.currency.rate) * Number(item.price)
      ).toFixed(2)}`)
  );

  const totalAmount = cart.items
    .reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
    .toFixed(2);
  const summary = {
    totalAmount: totalAmount,
    totalAmountConvert: (totalAmount * Number(user.currency.rate)).toFixed(2),
  };

  console.log(summary);

  return res.render('pages/Shopping/Checkout/page', {
    page: 'checkout',

    summary,
    userData: req.restrictUserData,
    userAllAddress: req.user.address,
    cart,

    deliveryDate: new Intl.DateTimeFormat('en-US').format(
      new Date(new Date().setDate(2))
    ),
  });
});
