const User = require('../../Model/user/userModel');
const AppError = require('../../utils/AppError');
const send = require('../../utils/sendJSON');
const catchAsync = require('../../utils/catchAsync');
const wishListController= require('../User/wishlistController')

const { default: mongoose } = require('mongoose');

// create-account
exports.createAccount = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check account exist
  const userExist = await Promise.all([
    User.findOne({ name }).exec(),
    User.findOne({ email }).exec(),
  ]);

  const [userWithNameAlreadyExist, userWithEmailAlreadyExist] = userExist;

  if (userWithNameAlreadyExist)
    return next(
      new AppError(
        {
          title: 'Name already exist',
          text: 'Account with name already exist',
        },
        400
      )
    );
  if (userWithEmailAlreadyExist)
    return next(
      new AppError(
        {
          title: 'Email already exist',
          text: 'Account with email account already exist',
        },
        400
      )
    );

  req.user = await User.create({ name, email, password });

  next();
});

// verify-email
exports.verifyAccount = catchAsync(async (req, res, next) => {
  req.user.emailVerify = true;


  await req.user.save();

  next()
});
