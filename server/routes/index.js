var util = require('../middleware/utilities');
var config = require('../config');

module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;

module.exports.logOut = logOut;

function index(req, res) {
  res.render('index', {
    title: 'Chat Site',
    currentUser: req.session.user ? req.session.user.id : null,
  });
}
function login(req, res) {
  res.render('login', {title: 'Login', message: req.flash('error')});
}
async function loginProcess(req, res) {
  const isAuth = await util.auth(req.body.username, req.body.password, req.session);
  if (isAuth) {
    res.redirect('/');
  } else {
    req.flash('error', 'Wrong Username or Password');
    res.redirect(config.routes.login);
  }
}

function logOut(req, res) {
  util.logOut(req.session);
  res.redirect('/');
}
