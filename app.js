const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/apiV1/users');
const orgRouter = require('./routes/apiV1/org');

// Middlewares
const tokenDecode = require('./lib/middlewares/tokenDecode');
const setUser = require('./lib/middlewares/setUser');
const orgValidator = require('./lib/middlewares/orgValidator');

const app = express();

require('./lib/connectMongoose');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración CORS
app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PATCH, PUT, POST, DELETE, OPTIONS'
  );
  next();
});

app.post('/apiV1/test/sender/mail', async (req, res, next) => {
  const {} = req.body;
  const sendEmail = require('./lib/clientEmailSender/clientEmailSender');
  try {
    await sendEmail(
      JSON.stringify({
        to: 'antunez19@gmail.com',
        from: 'luissanchez_1992@hotmail.com',
        templateId: process.env.EMAIL_CONTACT,
        dynamicTemplateData: {
          rol: 'Capitan de Mundo',
          user: 'Capitan jabugo',
          email: 'correo@capitanjabugo.com',
          mobile: 258258258,
          message: 'Me debes 6000 pts de Whisky',
        },
      })
    );
    res.end()
  } catch (error) { res.statusCode(500).json({error: error})}
});
app.use(tokenDecode);
app.use(setUser);
app.use('/apiV1/user', usersRouter);
app.use('/apiV1/org', orgValidator, orgRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log('handler', err);
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  res.status(err.status || 500);

  /**
   * Respuesta estándar de errores
   */
  res.json({
    status: 'error',
    data: err.alert || null,
    message: err.message,
    errorCode: err.status,
  });
  return;
  if (req.originalUrl.startsWith('/apiV1/')) {
    // Error que viene de la API
  }

  res.json({ error: err });
});

module.exports = app;

/* function x (loquesea) {
  return dispatch(loquesea)
}
*/
