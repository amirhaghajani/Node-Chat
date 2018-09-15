var io = require('socket.io'),
    connect = require('connect'),
    cookie = require('cookie'),
    expressSession = require('express-session'),
    ConnectRedis = require('connect-redis')(expressSession),
    redis = require('redis'),
    config = require('../config'),
    redisSession = new ConnectRedis({
        host: config.redisHost, port: config.redisPort
    });
var cookieParser = require('cookie-parser')(config.secret);

var socketAuth = function socketAuth(socket, next) {
    var handshakeData = socket.request;
    var parsedCookie = cookie.parse(handshakeData.headers.cookie);
    var sid;
    try {
        cookieParser(handshakeData, null, function (err) {
            sid = handshakeData.signedCookies['connect.sid'];
            // use handshake.signedCookies, since the
            // cookie parser has populated it
        });
    } catch (ex) {

    }

    if (parsedCookie['connect.sid'] === sid)
        return next(new Error('Not Authenticated'));
    redisSession.get(sid, function (err, session) {
        if (session.isAuthenticated) {
            socket.user = session.user;
            socket.sid = sid;
            return next();
        }
        else
            return next(new Error('Not Authenticated'));
    });
};

var socketConnection = function socketConnection(socket) {
    console.log('message goes ---- '+ socket.user);
    socket.emit('message', { message: 'Hey!' });
    socket.emit('message', socket.user);
};
exports.startIo = function startIo(server) {
    io = io.listen(server);
    var packtchat = io.of('/packtchat');

    packtchat.use(socketAuth);
    packtchat.on('connection', socketConnection);
    return io;
};