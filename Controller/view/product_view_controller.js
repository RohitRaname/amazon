/* eslint-disable camelcase */
const Product = require('../../Model/Product/product_model');
const catchAsync = require('../../utils/catchAsync');
const productController = require('../Product/product_controller');
const historyController = require('../User/historyController');
const inventoryController = require('../Shopping/inventoryController');
const AppError = require('../../utils/AppError');

exports.renderProductPage = catchAsync(async (req, res, next) => {
  const product_id = req.params.id;

  let userCurrencyInfo = false;

  // user-exist
  if (req.user) {
    userCurrencyInfo = req.user.currency;
  }
  console.log('req-user',req.user)

  // get product
  const product = await productController.getProductWithConvertedPrice(
    product_id,
    true,
    userCurrencyInfo
  );
  if (!product) return next(new AppError('Page not found', 500));

  if (req.user) {
    // saving viewed product in history
    if (req.user.recordHistory)
      historyController.saveHistory(req.user._id, {
        _id: product._id,
        thumbnail: product.assets.thumbnail,
        title: product.title,
      });
  }

  // variantsToCompare obj create -----------------------------------
  let productVariants =await Product.find({
    name: product.name,
    'model.isModel': true,
  })
    .limit(4)
    .exec();

  productVariants = productVariants.map((el) =>
    productController.convert_product_price(el, userCurrencyInfo)
  );
  const productVariantsCommonFieldValues = {};
  productVariants = productVariants.map((el) => {
    const newObj = {
      childVariantId: el.model.variantId,
      thumbnail: el.assets.thumbnail,
      title: el.title,
      price: el.price,
      rating: { count: el.rating.count, value: el.rating.value },
    };

    let specs = el.specs;
    specs = specs.map((spec) => ({ [spec.name]: spec.value }));

    specs.forEach((spec) => {
      const [key] = Object.keys(spec);
      newObj[key] = spec[key];
    });

    return newObj;
  });
  const productVariants_fields = Object.keys(productVariants[0]);
  productVariants.forEach((prod) => {
    productVariants_fields.forEach((prop) => {
      // property not exist
      if (!productVariantsCommonFieldValues[prop]) {
        productVariantsCommonFieldValues[prop] = [prod[prop]];
        return;
      }
      return productVariantsCommonFieldValues[prop].push(prod[prop]);
    });
  });


  // product obj to store as data-attr
  const productData = {
    _id: product._id,
    modelId: product.model._id,
    title: product.title,
    name: product.name,
    thumbnail: product.assets.thumbnail,
    price: product.price,
    convertPrice: product.convertPrice,
    color: product.curVariant.color.name,
    size: product.curVariant.size,
    rating: { count: product.rating.count, value: product.rating.value },
  };


  console.log(productData)

  return res.render('pages/product/page', {
    page: 'product',

    userData: req.restrictUserData,
    // to save as data as attr(limited and safe data that can be avail to public) in pug
    productData,

    product,

    // compare similar variants of product
    productVariantsCommonFieldValues,
    productVariants_fields,
  });
});
