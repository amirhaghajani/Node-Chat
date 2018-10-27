const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const path = require('path');

const myRedis = require('./models/redisDB');
myRedis.deleteAll();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const ConnectRedis = require('connect-redis')(session);
const config = require('./config');
const io = require('./socket.io');
const routes = require('./routes');
const routePost = require('./routes/postRoute');
const flash = require('connect-flash');
const util = require('./middleware/utilities');
const errorHandlers = require('./middleware/errorhandlers');
const csrf = require('csurf');
const partials = require('express-partials');

const context = require('./models/context');
context.createBaseInfo();
context.findAllRequest();


/**
 * Heroku-friendly production http server.
 *
 * Serves your app and allows you to proxy APIs if needed.
 */

const app = express();
const PORT = process.env.PORT || 8080;

// Enable various security helpers.
app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(partials());

const basePath = path.join(__dirname, '../');
app.use( '/dist', express.static(basePath + 'dist'));
app.use( '/static', express.static(basePath + 'static'));
app.use( '/node_modules', express.static(basePath + 'node_modules'));
app.use( '/src', express.static(basePath + 'src'));

app.use(cookieParser(config.secret));
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new ConnectRedis(
        { host: config.redisHost, port: config.redisPort }),
})
);

app.use(flash());
app.use(util.templateRoutes);
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);

// nodeAppServer(app);
app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.post(config.routes.postService, routePost.post);


app.get(config.routes.logout, routes.logOut);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

// Start up the server.
const server = app.listen(PORT, (err) => {
  if (err) {
    winston.error(err);
    return;
  }

  winston.info(`Listening on port ${PORT}`);
});
io.startIo(server);
