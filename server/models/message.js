const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const SCHEMA_MESSAGE = new Schema(
  {
    source: { type: user.schemaUser, required: true },
    destination: { type: user.schemaUser, required: true },
    message: { type: String },
  }
);

const Message = mongoose.model('Message', SCHEMA_MESSAGE, 'Message');

module.exports.ModelMassage = Message;

module.exports.addNewMessage = async(usrSource, usrDestination, message)=>{
  const newItem = new Message({ source: usrSource, destination: usrDestination, message: message });
  await newItem.save();
};
