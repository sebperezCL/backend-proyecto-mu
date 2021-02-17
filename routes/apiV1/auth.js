const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const admin = require('../../firebaseAuth/adminFirebase');

router.post('/registro', function (req, res, next) {
  const { email, password, name, surname } = req.body;
  admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: `${name} ${surname}`,
    })
    .then(data => {
      console.log('Successfully updated user', data.toJSON());
      res.status(200).json(data.toJSON()).end();
    })
    .catch(err => {
      console.log(err);
      return createError(500, err.message);
    });
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
