/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const userController = require('../../Controller/User/userController');
const { uploadMultipleFieldPhotos } = require('../../utils/multer');


Router.route('/')
  .patch(
    uploadMultipleFieldPhotos([
      { name: 'pic', maxCount: 1 },
      { name: 'cover_pic', maxCount: 1 },
    ]),
    userController.resizeImages,
    userController.updateMe
  )
  .get(userController.setUserIdAsParams, userController.apiGetUser);

// address

module.exports = Router;
