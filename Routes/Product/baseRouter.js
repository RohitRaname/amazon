/* eslint-disable camelcase */
const express = require('express');

const productRouter = require('./product_router');
const quesAnsRouter = require('./customerQuesAnsRouter');
const reviewRouter= require('./reviewRouter')

const Router = express.Router()


// all model Variant changes are applied
Router.use('/modelId/:modelId/ques-ans/',quesAnsRouter)
Router.use('/modelId/:modelId/reviews/',reviewRouter)
Router.use('/',productRouter)





module.exports = Router;
  