let io = require('socket.io');
const cookie = require('cookie');
const expressSession = require('express-session');
const ConnectRedis = require('connect-redis')(expressSession);
const config = require('../config');
const redisSession = new ConnectRedis({
  host: config.redisHost, port: config.redisPort,
});
const myRedis = require('../models/redisDB');
const cookieParser = require('cookie-parser')(config.secret);
const socketOp = require('./oprations');
const context = require('../models/context');


const socketAuth = function socketAuth(socket, next) {
  const handshakeData = socket.request;
  const parsedCookie = cookie.parse(handshakeData.headers.cookie);
  let sid;
  cookieParser(handshakeData, null, function(err) {
    sid = handshakeData.signedCookies['connect.sid'];
  });

  if (parsedCookie['connect.sid'] === sid) {
    console.log('Not Authenticated');
    return next(new Error('Not Authenticated'));
  }

  redisSession.get(sid, function(err, session) {
    if (session && session.isAuthenticated) {
      socket.user = session.user;
      socket.sid = sid;
      myRedis.set('socket_' + session.user.id, JSON.stringify({socketId: socket.id}));
      return next();
    }
    console.log('Not Authenticated');
    return next(new Error('Not Authenticated'));
  });
};

const socketConnection = function socketConnection(socket) {
  console.log('message goes ---- ' + socket.user);

  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`);
    if (socket.user) {
      myRedis.del('socket_' + socket.user.id);
    }
  });

  socket.on('sendMessageToUser', async (clientData)=>{
    console.log(clientData);
    await context.addMessage(socket.user.dbUser, clientData.userId, clientData.message.What);
    myRedis.get('socket_' + clientData.userId, (key)=>{
      console.log(key);
      debugger;
      if (key) {
        const data = JSON.parse(key);
        const tt = data.socketId.substr(data.socketId.indexOf('#') + 1);
        const ss = io.sockets.connected[tt];
        ss.client.sockets[data.socketId].emit('message', clientData.message);
      }
    });
  });

  socket.on('getHistory', (clientData)=>{
    socketOp.fetchHistory(socket.user.id, clientData, function(answer) {
      console.log('getHistory --' + JSON.stringify(answer));
      const items = [];
      items.push(answer);
      items.push(new Date().getTime());
      socket.emit('getHistory', items);
    });
  });
};

exports.startIo = function startIo(server) {
  console.log('startIo');
  io = io.listen(server);
  const packtchat = io.of('/ReactChat');

  packtchat.use(socketAuth);
  packtchat.on('connection', socketConnection);
  return io;
};
