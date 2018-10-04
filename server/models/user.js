const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_USER = new Schema(
  {
    name: {type: String, required: true, max: 100},
  }
);
const User = mongoose.model('User', SCHEMA_USER, 'User');
// Export model
module.exports.ModelUser = User;
module.exports.schemaUser = SCHEMA_USER;
module.exports.findUserByName = async (name)=> await User.find({name: name});

module.exports.createAllUser = async () => {
  try {
    const co = await User.find({}).limit(1);
    if (co.length > 0) return;

    const docs = await User.insertMany(userNames);
    console.log('Multiple User inserted to Collection - ' + docs.length);
  } catch (err) {
    console.log('error in createAllUser - ' + err);
  }
};

const userNames = [{name: 'amir1'}, {name: 'amir2'}, {name: 'amir3'}];
