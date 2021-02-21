const { response } = require('express');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const admin = require('../../firebaseAuth/adminFirebase');
const formatoResponse = require('../../lib/formatoResponse');
const { createUser } = require('../../controllers/usersController');

router.post('/registro', function (req, res, next) {
  const {
    email,
    password,
    name,
    surname,
    organization,
    fiscalNumber,
  } = req.body;

  admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      surname: surname,
      organization: organization,
      fiscalNumber: fiscalNumber,
      displayName: `${name} ${surname} `,
    })
    .then(data => {
      console.log(data);
      console.log('Successfully updated user', data.toJSON());
      res
        .status(201)
        .json(
          formatoResponse(
            'succes',
            data.toJSON(),
            'User successfully activated'
          )
        )
        .end();
    })
    .catch(err => {
      console.log(err);
      return createError(500, err.message);
    });

  //createUser()
});

router.post('/login', function (req, res, next) {
  const { email, password } = req.body;

  admin
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      console.log(user);
      res.end();
    })
    .catch(error => {
      console.log(error);
      return createError(500, error.message);
    });
});

module.exports = router;
