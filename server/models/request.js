const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencyM = require('./currency');
const countryM = require('./country');
const user = require('./user');

const SCHEMA_REQUEST = new Schema(
  {
    isNeed: {type: Boolean, required: true},
    currency: { type: currencyM.schemaCurrency, required: true },
    country: { type: countryM.schemaCountry, required: true },
    user: { type: user.schemaUser, required: true },
    amount: { type: Number, required: true },
    unitPrice: { type: Number },
  }
);
// Export model
const Request = mongoose.model('Request', SCHEMA_REQUEST, 'Request');

module.exports.addNewRequest = async(usr, isNeed, amount, country, currency, unitPrice)=>{
  const newItem = new Request({ isNeed: isNeed === '2', amount: amount, user: usr,
    currency: currency, country: country, unitPrice: unitPrice});
  await newItem.save();
};

module.exports.ModelRequest = Request;
