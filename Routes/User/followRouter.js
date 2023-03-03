/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const followController = require('../../Controller/User/followController');


Router.patch('/follow/:id',followController.followUser)
Router.patch('/unfollow/:id',followController.unFollowUser)


module.exports = Router;
