const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_CURRENCY = new Schema(
  {
    name: {type: String, required: true, max: 100},
  }
);
const Currency = mongoose.model('Currency', SCHEMA_CURRENCY, 'Currency');
// Export model
module.exports.ModelCurrency = Currency;
module.exports.schemaCurrency = SCHEMA_CURRENCY;
module.exports.findCurrencyByName = async (name)=> await Currency.find({name: name});

module.exports.createAllCurrency = async () => {
  try {
    const co = await Currency.find({ }).limit(1);
    if (co.length > 0) return;

    const docs = await Currency.insertMany(currencyNames);
    console.log('Multiple Currency inserted to Collection - ' + docs.length);
  } catch (err) {
    console.log('error in createAllCurrency - ' + err);
  }
};

const currencyNames = [{name: 'USD'}, {name: 'EUR'}, {name: 'CAD'}, {name: 'IRR'}];
