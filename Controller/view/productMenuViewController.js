const catchAsync = require('../../utils/catchAsync');
const productController = require('../Product/product_controller');

exports.renderProductMenuPage = catchAsync(async (req, res, next) => {
  req.query.limit = 10;
  req.query.page = 0;

  const result = await productController.getProductMenu(
    req.query,
    req.user && req.user.currency
  );
    
  

  let {
    summary,
    categoryByScreenHeight,
    categoryBySize,
    categoryByColor,
    categoryByPrice,
    docs,
  } = result;

  if(!result) docs=[];


  return res.render('pages/productMenu/page', {
    page: 'productMenu',

    summary,
    categoryByScreenHeight,
    categoryBySize,
    categoryByColor,
    categoryByPrice,
    docs,

    searchWord: req.query.q,
    userData: req.restrictUserData,
  });
});
