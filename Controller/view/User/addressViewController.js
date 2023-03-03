const User = require('../../../Model/user/userModel');

// SIGNUP _--------------------------------------------
const catchAsync = require('../../../utils/catchAsync');
exports.renderManageAddresses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id, { address: 1 });

  res.render('pages/address/manageAddress/page', {
    page:"manage-addresses",
    userData: req.restrictUserData,
    addresses: user.address,
  });
});
exports.renderAddAddress = catchAsync(async (req, res) => {
  res.render('pages/address/addAddress/page', {
    page:"add-address",
    userData: req.restrictUserData,
  });
});
