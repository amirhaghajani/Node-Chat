var util = require('../middleware/utilities');
var config = require('../config');

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

function post(req, res) {
  console.log('post ' + req.body.firstName);
  res.json({test: 11});
}

function logOut(req, res) {
  util.logOut(req.session);
  res.redirect('/');
}
