var express = require('express');
var app = express();
var routes = require('./routes');
var errorHandlers = require('./middleware/errorhandlers');
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var csrf = require('csurf');


app.use(partials());
app.use(express.static(__dirname + '/static'));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: new RedisStore(
        { url: 'redis://localhost' })
})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(3000);
console.log("App server running on port 3000");
console.log(__dirname + '/static');