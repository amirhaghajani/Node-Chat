const mongoose = require('mongoose');
const user = require('./user');

const SCHEMA_CHATROOM = new Schema(
  {
    source: { type: user.schemaUser, required: true },
    destination: { type: user.schemaUser, required: true },
    isBlock: { type: boolean },
  }
);

const ChatRoom = mongoose.model('ChatRoom', SCHEMA_CHATROOM, 'ChatRoom');

module.exports.ModelMyChatRoom = ChatRoom;

