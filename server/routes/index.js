var util = require('../middleware/utilities');
var config = require('../config');
const context = require('../models/context');
const userM = require('../models/user');

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.post = post;
module.exports.logOut = logOut;

function index(req, res) {
    res.cookie('IndexCookie', 'This was set from Index');
    res.render('index', {
      title: 'Index',
      cookie: JSON.stringify(req.cookies),
      session: JSON.stringify(req.session),
      signedCookie: JSON.stringify(req.signedCookies)
    });
}
function login(req, res) {
  res.render('login', {title: 'Login', message: req.flash('error')});
}
function loginProcess(req, res) {
  const isAuth = util.auth(req.body.username, req.body.password, req.session);
  if (isAuth) {
    res.redirect('/');
  } else {
    req.flash('error', 'Wrong Username or Password');
    res.redirect(config.routes.login);
  }
}

async function post(req, res) {
  if (!req.session.isAuthenticated) res.json({ hasError: true, errorMessage: 'Please Authenticate' });

  try {
    if (!req.session.user.id) {
      const usr = await userM.findUserByName(req.session.user.username);
      req.session.user.dbUser = usr[0];
      req.session.user.id = usr[0]._id;
    }
    switch (req.body.type) {
    case 'addNewRequest':
      await context.addNewRequest(req.session.user.dbUser, req.body.isNeed, req.body.amount, req.body.currency, req.body.country);
      break;
    case 'allRequest':
      const requests = await context.findAllRequest();
      res.json(requests);
      break;
    default:
      res.json({ hasError: true, errorMessage: 'error: incorrect type for post' });
    }
  } catch (err) {
    console.log('error  ---------------------- ' + err);
    res.json({ hasError: true, errorMessage: '' + err });
    return;
  }
}

function logOut(req, res) {
  util.logOut(req.session);
  res.redirect('/');
}
