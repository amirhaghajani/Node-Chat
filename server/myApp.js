const express = require('express');
const app = express();
const routes = require('./routes');
const errorHandlers = require('./middleware/errorhandlers');
const cookieParser = require('cookie-parser');
const partials = require('express-partials');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const csrf = require('csurf');
const util = require('./middleware/utilities');
const flash = require('connect-flash');
const config = require('./config');
const io = require('./socket.io');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(partials());
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new RedisStore(
        { url: config.redisUrl }),
})
);
app.use(flash());
app.use(util.templateRoutes);
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
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

const server = app.listen(config.port);
io.startIo(server);
console.log('App server running on port 3000');
console.log(__dirname + '/static');
