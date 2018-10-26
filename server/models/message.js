const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const SCHEMA_MESSAGE = new Schema(
  {
    source: { type: user.schemaUser, required: true },
    destination: { type: user.schemaUser, required: true },
    date: {type: Date, required: true},
    message: { type: String },
  }
);

const Message = mongoose.model('Message', SCHEMA_MESSAGE, 'Message');

module.exports.ModelMassage = Message;

module.exports.addNewMessage = async(usrSource, usrDestination, message)=>{
  const newItem = new Message({ source: usrSource, destination: usrDestination, message: message, date: new Date() });
  await newItem.save();
};

module.exports.getChatHistory = (sourceUserId, destinationUserId, callBack) => {
  console.log('getChatHistory --------');
  Message.find({
    $or: [
      {'source._id': sourceUserId, 'destination._id': destinationUserId},
      {'source._id': destinationUserId, 'destination._id': sourceUserId},
    ]}).sort('date').exec( function(err, messages) {
      const items = [];
      messages.forEach(function(msg) {
        items.push({Who: msg.source._id, What: msg.message, When: msg.date.getTime()});
      });
      callBack(items);
    });
};
