'use strict';
const createError = require('http-errors');
const { matchedData } = require('express-validator');

const User = require('../models/User');
const admin = require('../firebaseAuth/adminFirebase');
const formatoResponse = require('../lib/formatoResponse');
const { createUser } = require('./usersController');

function registerAndCreateUser(req, res, next) {
  const { email, password, name, surname, organization, fiscalId } = req.body;

  admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      surname: surname,
      organization: organization,
      displayName: `${name} ${surname} `,
    })
    .then(data => {
      console.log(data);
      const user = matchedData(req, { includeOptionals: false });
      user.uid = data.uid;
      res
        .status(201)
        .json(
          formatoResponse('succes', data.toJSON(), 'User successfully created')
        )
        .end();
    })
    .catch(err => {
      console.log(err);
      return createError(500, err.message);
    });
}

function login(req, res, next) {
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
}

/**
 *! Sólo para pruebas
 */
function listFirebaseUsers(req, res, next) {
  admin
    .auth()
    .listUsers()
    .then(users => {
      res
        .status(201)
        .json(formatoResponse('succes', users, 'Users List'))
        .end();
    });
}

/**
 *! Sólo para pruebas
 */
function deleteFirebaseUser(req, res, next) {
  const { uid } = req.body;
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      res
        .status(201)
        .json(formatoResponse('succes', users, 'Users List'))
        .end();
    })
    .catch(err => next(createError(500, err.message)));
}

module.exports = {
  registerAndCreateUser,
  listFirebaseUsers,
  deleteFirebaseUser,
  login,
};
