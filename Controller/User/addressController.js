/* eslint-disable camelcase */
const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');
const send = require('../../utils/sendJSON');
const Factory = require('../handleFactoryController');
const User = require('../../Model/user/userModel');

exports.getAddress = catchAsync(async (req, res) => {
  const { id } = req.params;
  const address = req.user.address.find(
    (el) => el._id.toString() === id.toString()
  );

  return send(res, 200, 'address', address);
});

exports.addAddress = catchAsync(async (req, res) => {
  const { setAsDefaultAddress, fullName } = req.body;

  if (setAsDefaultAddress) {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          'address.$[el].setAsDefaultAddress': false,
        },
      },
      { arrayFilters: [{ 'el.setAsDefaultAddress': true }] }
    ).exec();
  }

  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { 'profile.fullName': fullName },
      $push: {
        address: req.body,
      },
    }
  ).exec();
  return send(res, 200, 'add address');
});
exports.updateAddress = catchAsync(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        'address.$[el]': req.body,
      },
    },
    {
      arrayFilters: [{ 'el._id': req.params.id }],
    }
  );
  return send(res, 200, 'add address');
});
exports.updateAddressZipcode = catchAsync(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        'address.$[el].zipcode': req.body.zipcode,
      },
    },
    {
      arrayFilters: [{ 'el._id': req.params.id }],
    }
  );
  return send(res, 200, 'add address');
});
exports.removeAddress = catchAsync(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        address: { _id: req.params.id },
      },
    }
  );
  return send(res, 200, 'remove address');
});
