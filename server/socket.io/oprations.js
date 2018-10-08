const context = require('../models/context');
module.exports.fetchHistory = fetchHistory;


function fetchHistory(currentUserId, request, callBack) {
  console.log('fetchHistory ' + currentUserId + ' ' + JSON.stringify( request ));
  context.getChatHistory(currentUserId, request.wantedUserId, callBack);
}
