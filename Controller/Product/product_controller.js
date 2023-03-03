/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Product = require('../../Model/Product/product_model');
const catchAsync = require('../../utils/catchAsync');
const tryCatch = require('../../utils/tryCatch');
const send = require('../../utils/sendJSON');
const Factory = require('../handleFactoryController');
const {
  formatQueryIntoPipeline,
} = require('../../utils/mongodbQueryConverter');

// product > model > variants
// iphone 14 > iphone 14 max > [color,size]

exports.searchProductAggPipeline = (
  productTitle,
  page,
  limit,
  returnStoredSource
) => {
  let pipeline = [
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                path: 'title',
                query: productTitle,
                fuzzy: {
                  prefixLength: 1,
                },
              },
            },
            {
              text: {
                path: 'title',
                query: productTitle,
                score: { boost: { value: 2 } },
              },
            },
          ],
          minimumShouldMatch: 1,
        },

        highlight: { path: 'title' },
        returnStoredSource,
      },
    },

    { $skip: Number(page) * Number(limit) },

    limit ? { $limit: Number(limit) } : null,

    { $set: { highlights: { $meta: 'searchHighlights' } } },
  ];

  return pipeline.filter((el) => el);
};

exports.search_products = tryCatch(
  async (productTitle, limit, returnStoredSource) =>
    await Product.aggregate(
      this.searchProductAggPipeline(productTitle, 0, limit, returnStoredSource)
    ).exec()
);

// other phone of same brand (iphone 10, iphone 14 pro, iphone 14 max, iphone 14 SE,iphone 11,iphone 12,iphone 13)
exports.searchSuggestedProductsQuery = (
  title,
  modelId,
  type,
  returnStoredSource
) => {
  const query =
    type === 'similar'
      ? {
          compound: {
            should: [
              {
                autocomplete: {
                  path: 'title',
                  query: title,
                  fuzzy: {
                    prefixLength: 1,
                  },
                },
              },
              {
                text: {
                  path: 'title',
                  query: title,
                  score: { boost: { value: 2 } },
                },
              },
            ],

            must: [
              {
                equals: {
                  path: 'model._id',
                  value: new mongoose.Types.ObjectId(modelId),
                },
              },
            ],
            minimumShouldMatch: 1,
          },
          returnStoredSource: returnStoredSource,
        }
      : {
          compound: {
            should: [
              {
                autocomplete: {
                  path: 'title',
                  query: title,
                  fuzzy: {
                    prefixLength: 1,
                  },
                },
              },
              {
                text: {
                  path: 'title',
                  query: title,
                  score: { boost: { value: 2 } },
                },
              },
            ],
            mustNot: [
              {
                equals: {
                  path: 'model._id',
                  value: new mongoose.Types.ObjectId(modelId),
                },
              },
            ],
            minimumShouldMatch: 1,
          },
          returnStoredSource: returnStoredSource,
        };

  return query;
};

exports.getSuggestedProducts = catchAsync(async (req, res, next) => {
  const { title, modelId, type } = req.params;
  const { page, limit, sort } = req.query;

  let searchQuery, pipeline, sortQuery;
  searchQuery = this.searchSuggestedProductsQuery(title, modelId, type, false);

  pipeline = [
    {
      $search: searchQuery,
    },

    { $skip: Number(page) * Number(limit) },

    { $limit: Number(limit) },

    {
      $project: {
        _id: 1,
        title: 1,
        thumbnail: '$assets.thumbnail',
        price: 1,
        rating: { count: '$rating.count', value: '$rating.value' },
      },
    },
  ];

  // applying sort qery
  if (sort) {
    const sortObj = {};
    sort.split(',').map((el) => {
      if (el.includes('-')) sortObj[el.slice(1)] = -1;
      else sortObj[el] = 1;
    });
    sortQuery = { $sort: sortObj };

    pipeline = [pipeline.slice(0, 1)[0], sortQuery, ...pipeline.slice(1)];
  }

  let docs = await Product.aggregate(pipeline).exec();

  if (req.user)
    docs = docs.map((doc) =>
      this.convert_product_price(doc, req.user.currency)
    );

  return send(res, 200, 'suggested-products', { docs });
});

exports.getSuggestedProductsTotalCount = catchAsync(async (req, res, next) => {
  const { title, modelId, type } = req.params;

  const searchQuery = this.searchSuggestedProductsQuery(
    title,
    modelId,
    type,
    true
  );

  const pipeline = [
    {
      $search: searchQuery,
    },

    { $group: { _id: null, count: { $sum: 1 } } },
  ];

  const result = await Product.aggregate(pipeline).exec();
  return send(res, 200, 'total-docs', { count: result[0].count });
});

// exports.getRandomProducts= catchAsync(async()=>{
//  return await Product.find({$random:10}).exec()
// })

/////////////////////////////////////////////////////////////////
// API
/////////////////////////////////////////////////////////////////
exports.apiSearchProductTitle = catchAsync(async (req, res) => {
  let products = await this.search_products(req.query.q, 10, true);
  products = products.map((product) => ({
    title: product.title,
    highlights: product.highlights,
  }));
  return send(res, 200, 'search-products', { docs: products });
});

exports.apiSearchProductPreviewInfo = catchAsync(async (req, res) => {
  const products = await this.search_products(
    req.params.productTitle,
    10,
    false
  );
  return send(res, 200, 'search-products', products);
});

exports.convertPrice = (value, currency) => {
  const { symbol, rate } = currency;
  return `${symbol}${(Number(value) * Number(rate)).toFixed(2)}`;
};

// 8 hr, _coding
exports.convert_product_price = (product, currency_info) => {
  if (!currency_info) return product;
  const { symbol, rate } = currency_info;

  product.convertPrice = {
    unit: symbol,
    value: (Number(product.price.value) * Number(rate)).toFixed(2),
  };
  return product;
};

// CONVERTED PRICE FOR PRODUCT -----------------------------
exports.getProductWithConvertedPrice = tryCatch(
  async (product_id, convert_price, currency_info) => {
    console.log('convert-price', convert_price, currency_info);
    const product = await Product.findOne({ _id: product_id }).exec();
    if (!product) return false;
    return convert_price
      ? this.convert_product_price(product, currency_info)
      : product;
  }
);

exports.get_products = tryCatch(
  async (product_ids, convert_price, currency_info) => {
    let products = await Product.find({ _id: { $in: product_ids } }).exec();
    if (convert_price) {
      const { symbol, rate } = currency_info;

      products.forEach((product) => {
        product.price.unit = symbol;
        product.price.value = Number(product.price.value) * Number(rate);
      });
    }

    products = convert_price
      ? products.map((product) =>
          this.convert_product_price(product, currency_info)
        )
      : products;

    return products;
  }
);

exports.updateModelAllVariants = catchAsync(async (req, res, next) => {
  await Product.updateMany(
    {
      'model._id': req.params.modelId,
    },
    {
      $set: req.body,
    }
  ).exec();
  return send(res, 200, 'update-model-all-variants');
});

exports.postManUpdateModelAllVariants = catchAsync(async (req, res, next) => {
  const { filter, updateBody } = req.body;

  await Product.updateMany(filter, updateBody).exec();
  return send(res, 200, 'update-model-all-variants');
});

// get from product from db
exports.getFormatProduct = tryCatch(async (productId, currencyInfo) => {
  let product = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productId) } },

    {
      $set: {
        url: {
          $concat: [
            '/',
            {
              $substr: [
                {
                  $reduce: {
                    input: { $split: ['$title', ' '] },
                    initialValue: '',
                    in: { $concat: ['$$value', '-', '$$this'] },
                  },
                },
                1,
                -1,
              ],
            },
            '/',
            {
              $toString: '$_id',
            },
          ],
        },
        modelId: '$model._id',

        thumbnail: '$assets.thumbnail',
        convertPrice: currencyInfo
          ? {
              unit: currencyInfo.symbol,
              value: {
                $floor: 
                  {
                    $multiply: [
                      { $toInt: '$price.value' },
                      { $toInt: currencyInfo.rate },
                    ],
                  },
               
              },
            }
          : '$price',
      },
    },

    {
      $unset: [
        'assets',
        'attributes',
        'description',
        'specs',
        'variants',
        'customerQuesAns',
        'model',
      ],
    },
  ]).exec();
  return product[0];
});

// set url,convert price,set thumbnail from asset ,remove unnecessary fields
exports.formatProduct = (product, convertPrice) => {
  const { _id, assets, curVariant } = product;
  product.url = `/${product.title.split(' ').join('-')}/${_id}`;

  product = this.convert_product_price(product, convertPrice);
  if (assets) {
    product.thumbnail = assets && assets.thumbnail;
    delete product.assets;
  }
  if (curVariant) {
    product.color = curVariant.color.name;
    product.size = curVariant.size;

    delete product.curVariant;
  }

  return product;
};

// ///////////////////////////////////////////////////
// Product MENU
exports.getProductMenu = tryCatch(async (query, userCurrency) => {
  let { limit, page } = query;
  limit = Number(limit) || 10;
  page = Number(page) || 0;

  if (!query.sort) {
    query.sort = '-rating.value';
  }

  // price query

  // position of doc
  const curPageFirstDocNumber = Number(page) * Number(limit);
  const curPageLastDocNumber = Number(Number(page) + 1) * Number(limit);

  let agg = await Product.aggregate([
    ...this.searchProductAggPipeline(query.q, 0, 0, false),

    {
      $facet: {
        // total items count and total pages
        summary: [
          ...formatQueryIntoPipeline(query, false, ['skip', 'limit', 'sort']),
          { $count: 'count' },
          {
            $set: {
              totalPage: { $ceil: { $divide: ['$count', Number(limit)] } },
              docsRange: `${curPageFirstDocNumber}-${curPageLastDocNumber}`,
              searchWord: query.q,
            },
          },
        ],

        categoryByScreenHeight: [
          {
            $project: { specs: 1 },
          },

          {
            $set: {
              specs: {
                $first: {
                  $filter: {
                    input: '$specs',
                    as: 'spec',
                    cond: { $eq: ['$$spec.name', 'screen_height'] },
                  },
                },
              },
            },
          },

          { $set: { screenHeight: '$specs.value' } },

          {
            $group: {
              _id: null,
              values: {
                $addToSet: { $substrCP: ['$screenHeight', 0, 8] },
              },
            },
          },

          { $set: { key: 'screenHeight' } },

          { $unset: ['_id', 'key'] },
        ],
        categoryBySize: [
          { $project: { size: '$curVariant.size' } },

          {
            $group: {
              _id: '$null',
              values: { $addToSet: '$size' },
            },
          },

          { $unset: ['_id'] },
        ],
        categoryByColor: [
          { $project: { color: '$curVariant.color' } },

          {
            $group: {
              _id: '$color.name',
              colorImg: { $first: '$color.color_img' },
            },
          },

          { $set: { color: '$_id' } },

          { $match: { color: { $ne: null } } },

          { $unset: ['_id'] },
        ],

        // products
        docs: [
          ...formatQueryIntoPipeline(query, false, []),

          {
            $project: {
              thumbnail: '$assets.thumbnail',

              title: 1,
              'rating.value': 1,
              'rating.count': 1,
              price: 1,
              color: '$curVariant.color.name',

              variantByColors: '$variants.colors',

              url: {
                $concat: [
                  '/',
                  {
                    $substr: [
                      {
                        $reduce: {
                          input: { $split: ['$title', ' '] },
                          initialValue: '',
                          in: { $concat: ['$$value', '-', '$$this'] },
                        },
                      },
                      1,
                      -1,
                    ],
                  },
                  '/',
                  {
                    $toString: '$_id',
                  },
                ],
              },

              convertPrice: userCurrency
                ? {
                    unit: userCurrency.symbol,
                    value: {
                      $round: [
                        {
                          $multiply: [
                            '$price.value',
                            Number(userCurrency.rate),
                          ],
                        },
                        2,
                      ],
                    },
                  }
                : '$price',
            },
          },

          { $unset: ['variantByColors._id'] },
        ],
      },
    },
  ]);

  agg = agg[0];
  if (agg.summary.length === 0) return false;
  agg.summary = agg.summary[0];
  agg.categoryByScreenHeight = agg.categoryByScreenHeight[0].values;
  agg.categoryBySize = agg.categoryBySize[0].values;
  agg.categoryByPrice = {
    symbol: userCurrency ? userCurrency.symbol : '$',
    range: userCurrency
      ? [25, 50, 100, 150, 200].map((el) =>
          Math.floor(el * Number(userCurrency.rate))
        )
      : [25, 50, 100, 150, 200],
  };

  return agg;
});
exports.apiGetProductMenu = catchAsync(async (req, res) => {
  const result = await this.getProductMenu(
    req.query,
    req.user && req.user.currency
  );
  return send(res, 200, 'product-menu', result);
});

exports.apiGetProduct = Factory.getOne(Product);
exports.apiGetProducts = Factory.getAll(Product);
exports.apiUpdateProduct = Factory.updateOne(Product);
exports.apiDeleteProduct = Factory.deleteOne(Product);
exports.apiCreateProduct = Factory.createOne(Product);
