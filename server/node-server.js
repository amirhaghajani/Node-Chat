const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const nodeAppServer = require('./node-app-server');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('./config');
const io = require('./socket.io');
const routes = require('./routes');
const flash = require('connect-flash');
const util = require('./middleware/utilities');
const errorHandlers = require('./middleware/errorhandlers');
const csrf = require('csurf');
const partials = require('express-partials');

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

nodeAppServer(app);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.post(config.routes.postService, routes.post);

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
