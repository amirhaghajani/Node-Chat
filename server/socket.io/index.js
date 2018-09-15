let io = require('socket.io');
const cookie = require('cookie');
const expressSession = require('express-session');
const ConnectRedis = require('connect-redis')(expressSession);
const config = require('../config');
const redisSession = new ConnectRedis({
  host: config.redisHost, port: config.redisPort,
});

const cookieParser = require('cookie-parser')(config.secret);

const socketAuth = function socketAuth(socket, next) {
  const handshakeData = socket.request;
  const parsedCookie = cookie.parse(handshakeData.headers.cookie);
  let sid;
  cookieParser(handshakeData, null, function(err) {
    sid = handshakeData.signedCookies['connect.sid'];
  });

  if (parsedCookie['connect.sid'] === sid) {
    return next(new Error('Not Authenticated'));
  }

  redisSession.get(sid, function(err, session) {
    if (session.isAuthenticated) {
      socket.user = session.user;
      socket.sid = sid;
      return next();
    }
    else {
      return next(new Error('Not Authenticated'));
    }
  });
};

const socketConnection = function socketConnection(socket) {
  console.log('message goes ---- ' + socket.user);
  socket.emit('message', { message: 'Hey!' });
  socket.emit('message', socket.user);
};
exports.startIo = function startIo(server) {
  console.log('startIo');
  io = io.listen(server);
  const packtchat = io.of('/packtchat');

  //packtchat.use(socketAuth);
  packtchat.on('connection', socketConnection);
  return io;
};
