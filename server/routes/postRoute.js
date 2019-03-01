const context = require('../models/context');

module.exports.post = post;

async function post(req, res) {
  console.log('Request post: ' + JSON.stringify(req.body));
  switch (req.body.type) {
  case 'addUserToChatWiths':
    if (!req.session || !req.session.isAuthenticated) {
      res.json({ hasError: true, errorMessage: 'Please Authenticate' });
      return;
    }
    await context.addUserToChatRoom(req.session.user.dbUser, req.body.userId, false);
    res.json({succ: true});
    break;
  case 'addNewRequest':
    if (!req.session || !req.session.isAuthenticated) {
      res.json({ hasError: true, errorMessage: 'Please Authenticate' });
      return;
    }
    try {
      await context.addNewRequest(req.session.user.dbUser, req.body.isNeed, req.body.amount, req.body.currency, req.body.country, req.body.unitPrice);
      res.json({});
    } catch (err) {
      console.log('error addNewRequest ' + err);
      res.json({ hasError: true, errorMessage: '' + err });
    }
    break;
  case 'allRequest':
    try {
      const requests = await context.findAllRequest(req.body.amount, req.body.country, req.body.currency, req.body.isNeed, req.body.lastInsertDate);
      console.log('allRequest: ' + JSON.stringify(requests));
      res.json({user: req.session.user ? req.session.user.id : null, request: requests} );
    } catch (err) {
      console.log('error allRequest ' + err);
      res.json({ hasError: true, errorMessage: '' + err });
    }
    break;

  case 'getChatUsers':
    try {
      context.getChatUsers(req.session.user.id, function(items) {
        res.json( items );
      });
    } catch (err) {
      console.log('error getChatUsers ' + err);
      res.json({ hasError: true, errorMessage: '' + err });
    }
    break;

  default:
    res.json({ hasError: true, errorMessage: 'error: incorrect type for post' });
  }
}
