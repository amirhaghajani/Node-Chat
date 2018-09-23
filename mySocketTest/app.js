var io = require('socket.io').listen(4000);

// io.on('connection', function (socket) {
// socket.emit('news', { hello: 'world' });
// socket.on('my other event', function (data) {
// console.log(data);
// });
// });

io.sockets.on('connection', function (socket) {
    socket.on('join', function (data) {
        console.log('join '+ data.username);
        socket.username = data.username;
        socket.broadcast.emit('join', {
            username: data.username, socket:
                socket.id
        });
    });
    socket.on('ping1', function () {
        console.log('ping from '+socket.username);
        socket.broadcast.emit('ping1', { username: socket.username });
    });
    socket.on('privatePing', function (data) {
        io.sockets.connected[data.socket].emit('ping1', {
            username:
                socket.username, priv: true
        });
    });
});


io.of('/vip').on('connection', function (socket) {
    socket.on('join', function (data) {
        console.log('vip join '+ data.username);
        socket.username = data.username;
        socket.broadcast.emit('join', {
            username: data.username, socket:
                socket.id
        });
    });
    socket.on('ping1', function () {
        console.log('vip ping from '+socket.username);
        socket.broadcast.emit('ping1', { username: socket.username });
    });
    socket.on('privatePing', function (data) {
        io.of('/vip').connected[data.socket].emit('ping1', {
            username:
                socket.username, priv: true
        });
    });
});
