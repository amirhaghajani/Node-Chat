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

module.exports.createBaseInfo = () => {
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

module.exports.findAllRequest = async () => {
  try {
    return await requestM.ModelRequest.find({});
  } catch (err) {
    return console.log(err);
  }
};

module.exports.addUserToChatRoom = async (source, destinationUserId) => {
  debugger;
  const query = { 'source._id': source._id, 'destination._id': destinationUserId };

  await myChatRoomM.ModelMyChatRoom.findOne(query, function find(err, chatRoom) {
    if (err) {
      console.log(err);
      return false;
    }
    if (chatRoom) return true;

    userM.ModelUser.find({_id: destinationUserId}, function(err,dest) {
      if (err) {
        console.log(err);
        return;
      }
      const newItem = new myChatRoomM.ModelMyChatRoom({ source: source, destination: dest[0], isBlock: false });
      newItem.save(function sv(errS) {
        if (!errS) {
          console.log('save new chatRoom');
        }
        else {
          console.log('Error: could not save ChatRoom ' + errS);
        }
      });
    });

    
    return true;
  });
};
