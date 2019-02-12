const config = {
  port: 8090,
  secret: 'www.m&y^P^a&0/s?s!2228@#$!)_++~```',
  redisPort: 6379,
  redisHost: 'localhost',
  mongoDb: 'mongodb://localhost:27017/ShareMoneyDB',
  routes: {
    login: '/login',
    logout: '/logout',
    postService: '/post',
  },
};
module.exports = config;
