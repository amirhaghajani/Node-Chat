var util = require('../middleware/utilities');
var config = require('../config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



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
  console.log('post --' + req.body.firstName);

  mongoose.connect('mongodb://localhost:27017/ShareMoneyDB', { useNewUrlParser: true });
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  db.on('open', function save1() {
    console.log('conneciton to mongo succ -- ');
    const BookSchema = mongoose.Schema({
      name: String,
    });
    const Book = mongoose.model('Book', BookSchema, 'BookStore');
    const book1 = new Book({name: 'Test'});
    book1.save(function save2(err, book) {
      if (err) return console.log('errore in save in mongo db ' + err);
      console.log(book.name + ' save to db');
    });
  });

  res.json({test: 11});
}

function logOut(req, res) {
  util.logOut(req.session);
  res.redirect('/');
}
