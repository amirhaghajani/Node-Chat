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
var util=require('./middleware/utilities');
var flash = require('connect-flash');
var config = require('./config');

app.set('view engine', 'ejs');
app.set('views',__dirname+'/views');
app.use(partials());
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore(
        { url: config.redisUrl })
})
);
app.use(flash());
app.use(util.templateRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get('/chat', routes.chat);
app.get(config.routes.logout, routes.logOut);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(config.port);
console.log("App server running on port 3000");
console.log(__dirname + '/static');