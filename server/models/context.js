const mongoose = require('mongoose');
const config = require('../config');
const countryM = require('./country');
const currencyM = require('./currency');
const requestM = require('./request');
const userM = require('./user');
const myChatRoomM = require('./myChatRoom');
const messageM = require('./message');

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

module.exports.addNewRequest = async (user, isNeed, amount, currency, country, unitPrice) => {
  if (isNeed === null || amount === null ||
    currency === null || country === null) throw new Error('select all');
  const wCountry = await countryM.findCountryByName(country);
  const wCurrency = await currencyM.findCurrencyByName(currency);
  await requestM.addNewRequest(user, isNeed, amount, wCountry[0], wCurrency[0], unitPrice);
};

module.exports.findAllRequest = async (amount, country, currency, isNeed, lastInsertTime) => {
  try {
    const query = {};
    if (country) query['country.name'] = country;
    if (currency) query['currency.name'] = currency;
    if (amount) query.amount = { $gte: amount };
    query.isNeed = isNeed;
    if (lastInsertTime) query.date = { $lt: lastInsertTime };

    let wantMinMax = true;
    if (country || currency || amount || lastInsertTime) wantMinMax = false;

    let amountMax = null;
    let amountMin = null;
    let unitPricMax = null;
    let unitPriceMin = null;
    if (wantMinMax) {
      amountMax = await requestM.ModelRequest.find({}).sort({amount: -1}).limit(1).select({ amount: 1});
      amountMin = await requestM.ModelRequest.find({}).sort({amount: 1}).limit(1).select({ amount: 1});

      unitPricMax = await requestM.ModelRequest.find({}).sort({unitPrice: -1}).limit(1).select({ unitPrice: 1});
      unitPriceMin = await requestM.ModelRequest.find({}).sort({unitPrice: 1}).limit(1).select({ unitPrice: 1});
    }

    const items = await requestM.ModelRequest.find(query).limit(6).sort({ 'date': 'desc' });
    return {amountMax: amountMax, amountMin: amountMin, unitPricMax, unitPriceMin, items: items };
  } catch (err) {
    return console.log(err);
  }
};

module.exports.findUserByName = async (usrName) => {
  const usr = await userM.findUserByName(usrName);
  return usr;
};

addUserToChatRoom = async (source, destinationUserId, isSecond) => {
  const query = { 'source._id': source._id, 'destination._id': destinationUserId };

  await myChatRoomM.ModelMyChatRoom.findOne(query, function find(err, chatRoom) {
    if (err) {
      console.log(err);
      return false;
    }
    if (chatRoom) return true;

    userM.ModelUser.find({ _id: destinationUserId }, function (err, dest) {
      if (err) {
        console.log(err);
        return;
      }
      if (!isSecond) {
        addUserToChatRoom(dest[0], source._id, true);
      }
      const newItem = new myChatRoomM.ModelMyChatRoom({ source: source, destination: dest[0], isBlock: false, date: new Date() });
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

module.exports.addUserToChatRoom = addUserToChatRoom;

module.exports.getChatUsers = (sourceUserId, callBack) => myChatRoomM.getChatUsers(sourceUserId, callBack);

module.exports.addMessage = async (sourceUser, destinationUserId, message) => {
  const desUser = await userM.findUserById(destinationUserId);
  await messageM.addNewMessage(sourceUser, desUser[0], message);
};

module.exports.getChatHistory = (sourceUserId, destinationUserId, callBack) => messageM.getChatHistory(sourceUserId, destinationUserId, callBack);
