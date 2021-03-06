const context = require('../models/context');

module.exports.post = post;

async function post(req, res) {
  switch (req.body.type) {
  case 'addUserToChatWiths':
    if (!req.session || !req.session.isAuthenticated) {
      res.json({ hasError: true, errorMessage: 'Please Authenticate' });
      return;
    }
    await context.addUserToChatRoom(req.session.user.dbUser, req.body.userId);
    res.json({succ: true});
    break;
  case 'addNewRequest':
    if (!req.session || !req.session.isAuthenticated) {
      res.json({ hasError: true, errorMessage: 'Please Authenticate' });
      return;
    }
    try {
      await context.addNewRequest(req.session.user.dbUser, req.body.isNeed, req.body.amount, req.body.currency, req.body.country);
    } catch (err) {
      console.log('error addNewRequest ' + err);
      res.json({ hasError: true, errorMessage: '' + err });
    }
    break;
  case 'allRequest':
    try {
      const requests = await context.findAllRequest();
      res.json({user: req.session.user ? req.session.user.id : null, request: requests} );
    } catch (err) {
      console.log('error allRequest ' + err);
      res.json({ hasError: true, errorMessage: '' + err });
    }
    break;
  default:
    res.json({ hasError: true, errorMessage: 'error: incorrect type for post' });
  }
}
