const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const SCHEMA_CHATROOM = new Schema(
  {
    source: { type: user.schemaUser, required: true },
    destination: { type: user.schemaUser, required: true },
    date: {type: Date, required: true},
    isBlock: { type: Boolean },
  }
);

const ChatRoom = mongoose.model('ChatRoom', SCHEMA_CHATROOM, 'ChatRoom');

module.exports.ModelMyChatRoom = ChatRoom;

module.exports.getChatUsers = async(sourceUserId, callBack)=>{
  ChatRoom.find({'source._id': sourceUserId}, function(err, rooms) {
    const items = [];

    rooms.forEach(function(item) {
      items.push({id: item.destination._id, name: item.destination.name});
    });
    console.log(items);
    callBack(items);
  });
};
