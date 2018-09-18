const mongoose = require('mongoose');
const config = require('../config');
const countryM = require('./country');
const currencyM = require('./currency');
const requestM = require('./request');
const userM = require('./user');

mongoose.connect(config.mongoDb, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.createBaseInfo = ()=>{
  console.log('createBaseInfo');
  countryM.createAllCountry();
  currencyM.createAllCurrency();
  userM.createAllUser();
};

module.exports.addNewRequest = async (user, isNeed, amount, currency, country) => {
  if (isNeed === null || amount === null ||
    currency === null || country === null) throw new Error('select all');
  const wCountry = await countryM.findCountryByName(country);
  const wCurrency = await currencyM.findCurrencyByName(currency);
  await requestM.addNewRequest(user, isNeed, amount, wCountry[0], wCurrency[0]);
};

module.exports.findAllRequest = async ()=> {
  try {
    return await requestM.ModelRequest.find({});
  } catch (err) {
    return console.log(err);
  }
};
