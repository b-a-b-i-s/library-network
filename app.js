const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const session = require('express-session');

const app = express()

const MemoryStore = require('memorystore')(session)


app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  name: 'library-network',
  secret: process.env.SESSION_SECRET || 'enterasecrethere', // κλειδί για κρυπτογράφηση του cookie
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 24 * 60 * 60 * 1000,
  },
  store: new MemoryStore({ checkPeriod: 86400000 })
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.loggedUserId;
  next();
})

//Διαδρομές - Routse
const routes = require('./routes/library-network-routes');
app.use('/', routes);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.errorstatus = err.status || 500;
  res.locals.errorstack = req.app.get('env') === 'development' ? err.stack : '';

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout:'404.hbs'});
});
  

module.exports = app;
