const config = require('../config');
const redis = require('redis');
const client = redis.createClient(config.redisPort, config.redisHost);

client.on('connect', function connectRedis() {
  console.log('Redis client connected');
});

client.on('error', function redisError(err) {
  console.log('Redis Error. Something went wrong - ' + err);
});

module.exports.set = (key, value) => client.set(key, value, redis.print);
module.exports.get = (key) => client.get(key, function getRedis(error, result) {
  if (error) {
    console.log('Redis Key Get Error - ' + error);
    throw error;
  }
});
module.exports.del = (key) => client.del(key, function delRedis(err, response) {
  if (response == 1) {
    console.log('Redis key Deleted Successfully!');
  } else {
    console.log('Cannot delete Redis Key');
  }
});
module.exports.deleteAll = () => client.flushdb( function delAllRedis(err, succeeded) {
  console.log('Delete All Redis Keys: ' + succeeded); // will be true if successfull
});

