/* eslint-disable camelcase */
const express = require('express');

const Router = express.Router();

// controller -----------------------
const historyController = require('../../Controller/User/historyController');

// history
Router.route('/')
  .post(historyController.apiSaveHistory)
  .get(historyController.apiGetHistory)
  .delete(historyController.apiDeleteAll);

Router.route('/:id').delete(historyController.apiDeleteOne);

Router.get('/count', historyController.apiGetHistoryItemsCount);

module.exports = Router;
