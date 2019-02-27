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
module.exports.findUserById = async (userId)=> await User.find({_id: userId});

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

const userNames = [{_id: '5ba113664f3acc0d4d8a4971', name: 'Aghajani'},
{_id: '5ba113664f3acc0d4d8a4972', name: 'Babaei'},
{_id: '5ba113664f3acc0d4d8a4973', name: 'Jahani'},
];
