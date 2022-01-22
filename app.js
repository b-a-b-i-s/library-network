require('dotenv').config();
const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const session = require('express-session');

const router = require('./routes/library-network-routes');

const app = express()






app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', engine({ extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set session
const sess = {
  name: 'library-network',
  secret: process.env.SESSION_SECRET || 'enterasecrethere', // κλειδί για κρυπτογράφηση του cookie
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 24 * 60 * 60 * 1000,
  },
  // store: new MemoryStore({ checkPeriod: 86400000 })
//  
}

if (app.get('env') === 'production') {
  // app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies

  const redis = require("redis");
  // let redisClient = redis.createClient({url: process.env.REDIS_URL});
  const redisClient = redis.createClient({
    url: process.env.REDIS_TLS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
  });
  let RedisStore = require('connect-redis')(session)
  sess.store = new RedisStore({ client: redisClient })
}
else {
    const MemoryStore = require('memorystore')(session)
    sess.store = new MemoryStore({ checkPeriod: 86400000 })
}

app.use(session(sess));


// app.use((req, res, next) => {
  // res.locals.userId = req.session.loggedUserId;
  // next();
// })

// Διαδρομές - Routes
app.use('/', router);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.errorstatus = err.status || 500;
  res.locals.errorstack = req.app.get('env') === 'development' ? err.stack : '';

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout:'404.hbs'});
});
  

module.exports = app;
