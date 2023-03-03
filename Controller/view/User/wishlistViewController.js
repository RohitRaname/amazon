/* eslint-disable camelcase */
const catchAsync = require('../../../utils/catchAsync');
const wishlistController = require('../../User/wishlistController');

exports.renderWishlistPage = catchAsync(async (req, res) => {
  // get all wishlists

  const curWishlistId = req.params.id;
  // get current wishlist and its all items

  let wishlists = [];
  let curWishlishItems = [];

  [wishlists, curWishlishItems] = await Promise.all([
    wishlistController.getWishlists(req.user._id),
    wishlistController.getWishlistItems(req.user._id, curWishlistId, {
      sort: { ts: -1 },
      filter: 'all',
    }),
  ]);

  res.render('pages/wishlist/page', {
    page: 'wishlist',
    userData: req.restrictUserData,
    wishlists,
    curWishlist: req.user.wishlists.find(
      (el) => el._id.toString() === curWishlistId.toString()
    ),
    curWishlishItems,
  });
});
