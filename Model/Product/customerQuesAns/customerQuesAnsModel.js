const mongoose = require('mongoose');
const CustomerQuesAnsSchema = require('./customerQuesAnsSchema');
CustomerQuesAnsSchema.index({modelId:1})

const CustomerQuesAns = mongoose.model(
  'CustomerQuesAns',
  CustomerQuesAnsSchema
);


module.exports = CustomerQuesAns;
