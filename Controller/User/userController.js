/* eslint-disable camelcase */
const axios = require('axios');
const sharp= require('sharp');
const catchAsync = require('../../utils/catchAsync');
const send = require('../../utils/sendJSON');
const Factory = require('../handleFactoryController');
const User = require('../../Model/user/userModel');
const tryCatch = require('../../utils/tryCatch');
const UserActivity = require('../../Model/user/userActivityModel');

const topLevelBucketController = require('../userBucketController/topLevelList');

exports.setUserCurrencyAndAddressForOnce = catchAsync(
  async (req, res, next) => {
    if (!req.user) return next();

    if (req.user && req.user.address && req.user.address.length === 0) {
      try {
        const { user } = req;
        const response =
          await axios.get(`${process.env.LOCATION_API}&fields=country_name,state_prov,zipcode,
        district,city,state_prov,languages,country_flag,currency`);

        const { data } = response;
        if (data.error) return next();

        const address = {
          setAsDefaultAddress: true,
          state: data.state_prov,
          district: data.district,
          country: data.country_name,
          zipcode: data.zipcode,
        };

        user.address = [address];
        user.country_flag = data.country_flag;
        user.currency = data.currency;

        const currecy_response = await axios.get(
          `https://api.apilayer.com/fixer/convert?apikey=${process.env.CURRENCY_API}&from=USD&to=${data.currency.code}&amount=1000`
        );

        const currency_data = currecy_response.data;

        user.currency.rate = currency_data.info.rate;

        const newUser = await user.save();
      } catch (err) {
        console.error(err);
        return next();
      }
    }
    next();
  }
);

exports.setRestrictUserDataInReq = (req, res, next) => {
  if (!req.user) return next();

  const { user } = req;

  const defaultAddress = user.address.find((el) => el.setAsDefaultAddress);
  const { city, state, country, zipcode } = defaultAddress;

  req.restrictUserData = {
    profile: { _id: user._id, name: user.name, pic: user.profile.pic },
    currency:req.user.currency,
    wishlists: user.wishlists,
    history: user.history,
    address: defaultAddress,
    fullAddress: `${city} ${state} ${country} ${zipcode}`,
    count:user.count
  };

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const nonAcceptableFields = ['email', 'password'];

  nonAcceptableFields.forEach((field) => {
    if (req.body[field]) delete req.body[field];
  });

  await User.updateOne({ _id: req.user._id }, { $set: req.body }).exec();
  return send(res, 200, 'user-updated');
});


 
const save_img = tryCatch(async (file, dimension, filename) => {
  await sharp(file.buffer)
    .resize(...dimension)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${filename}`);
});


// ques has answer property in it
exports.resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  const img_promise = [];

  const { cover_pic, pic } = req.files;


  if (cover_pic) {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    req.body["profile.cover_pic"] = filename;

    img_promise.push(save_img(cover_pic[0], [1200, 1080], filename));
  }
  if (pic) {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    req.body["profile.pic"] = filename;

    img_promise.push(save_img(pic[0], [600, 600], filename));
  }

  if (img_promise.length > 0) await Promise.all(img_promise);

  // req.body.pic = filename;

  next();
};


exports.setUserIdAsParams = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

///////////////////////////////////////////////
// AddressController
///////////////////////////////////////////////

exports.apiGetUser = Factory.getOne(User);
exports.apiGetUsers = Factory.getAll(User);
exports.apiUpdateUser = Factory.updateOne(User);
exports.apiDeleteUser = Factory.deleteOne(User);
exports.apiCreateUser = Factory.createOne(User);
