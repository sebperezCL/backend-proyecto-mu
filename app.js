const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const auth = require('./routes/apiV1/auth');
const usersRouter = require('./routes/apiV1/users');
const rolValidator = require('./lib/middlewares/rolValidator')

const app = express();

require('./lib/connectMongoose');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

// EJS Para qué??--------------------------------------------------------------------------------------<
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  console.log(req.header())
  
  res.end(200).end()
})
//app.use('/auth', auth);
app.use('/apiV1/user', usersRouter);

//app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log('handler', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  /**
   * Respuesta estándar de errores
   */
  if (req.originalUrl.startsWith('/api/')) {
    // Error que viene de la API
    res.json({
      status: 'error',
      data: err.alert || null,
      message: err.message,
      errorCode: err.status,
    });
    return;
  }

  res.json({ error: err });
});

module.exports = app;
