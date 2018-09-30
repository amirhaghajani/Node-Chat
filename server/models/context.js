const mongoose = require('mongoose');
const config = require('../config');
const countryM = require('./country');
const currencyM = require('./currency');
const requestM = require('./request');
const userM = require('./user');
const myChatRoomM = require('./myChatRoom');

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

module.exports.addUserToChatRoom = async(source, destination)=>{
  const query = {source: source, destination: destination};
  const update = {};
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the document
  await myChatRoomM.ModelMyChatRoom.findOneAndUpdate(query, update, options, function findOneAndUpdateCallBack(error, result) {
    if (error) return;

    // If the document doesn't exist
    if (!result) {
      // Create it
      const newItem = new myChatRoomM.ModelMyChatRoom({source: source, destination: destination, isBlock: false});
      newItem.save();
    }
  });
};
