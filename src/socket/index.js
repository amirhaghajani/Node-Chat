import openSocket from 'socket.io-client';
let socket;
const channel = 'ReactChat';

export function subscribe(initObj) {
  socket = openSocket('/' + channel);

  socket.on('message', payload => initObj.message(payload));
  socket.on('presence', payload => initObj.presence(payload));
}

export function history(inputObj) {
  socket.emit('getHistory', {count: inputObj.count, wantedUserId: inputObj.wantedUserId});
  socket.on('getHistory', payload => inputObj.callback(payload));
}

export function publish(data) {
  socket.emit('sendMessageToUser', data);
}
