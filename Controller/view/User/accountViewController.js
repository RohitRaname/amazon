const catchAsync = require('../../../utils/catchAsync');

// SIGNUP _--------------------------------------------
exports.renderAccountPage = catchAsync(async (req, res) => {
  res.render('pages/accountPage', {
    page:"myAccount",
    userData: req.restrictUserData,
  });
});
