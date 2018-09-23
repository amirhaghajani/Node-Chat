const config = require('../config');
const userM = require('../models/user');

module.exports.csrf = function csrf(req, res, next) {
  res.locals.token = req.csrfToken();
  next();
};

module.exports.authenticated = function authenticated(req, res, next) {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  if (req.session.isAuthenticated) {
    res.locals.user = req.session.user;
  }
  next();
};

module.exports.requireAuthentication = function requireAuthentication(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect(config.routes.login);
  }
};

module.exports.auth = async function auth(username, password, session) {
  try {
    debugger;
    const usr = await userM.findUserByName(username);
    if (usr.length > 1) {
      console.log('Find more than 1 user - ' + username);
    }
    if (usr.length !== 1) return false;

    session.isAuthenticated = true;
    session.user = { username: username, dbUser: usr[0], id: usr[0]._id};
    return true;
  } catch (err) {
    console.log('error on user authentication - ' + err);
    res.json({ hasError: true, errorMessage: '' + err });
    return false;
  }
};

module.exports.logOut = function logOut(session) {
  session.isAuthenticated = false;
  delete session.user;
};

exports.templateRoutes = function templateRoutes(req, res, next){
  res.locals.routes = config.routes;
  next();
};
