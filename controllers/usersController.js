'use strict';

const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');
const formatoResponse = require('../lib/formatoResponse');
const admin = require('../firebaseAuth/adminFirebase');

/**
 * Crea un nuevo usuario en la db, los datos del usuario
 * vienen en el body
 */
async function createUser(req, res, next) {
  try {
    const data = matchedData(req);
    console.log(data);

    const usuario = await User.findOne({ email: data.email });

    if (usuario)
      return next(createError(500, 'El usuario ya existe en la base de datos'));

    const user = new User(data);
    await user.save();

    res
      .status(201)
      .json(formatoResponse('success', user, 'Usuario creado con éxito'));
  } catch (error) {
    console.log(error, 'dentro del error');
    return next(createError(500, error.message));
  }
}

/**
 * Desactiva un usuario del sistema
 */
async function enableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'El usuario NO existe en la base de datos'));

    usuario.activo = true;
    await usuario.save();

    res
      .status(200)
      .json(formatoResponse('success', user, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * Deshabilita un usuario del sistema
 */
async function disableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'El usuario NO existe en la base de datos'));

    usuario.activo = false;
    await usuario.save();

    res
      .status(200)
      .json(
        formatoResponse('success', user, 'Usuario deshabilitado con éxito')
      );
  } catch (error) {
    return next(createError(500, error.message));
  }
}

/**
 * Retorna un usuario
 */
async function getUser(req, res, next) {
  console.log(req.userData.email, '<-- userdata');
  try {
    const user = await User.findOne({ email: req.userData.email });

    if (!user) {
      return res
        .status(200) //! Deberia devolver 200, no 404
        .json(
          formatoResponse(
            'user not found',
            '',
            'User not created',
            'NOUSERDATABASE'
          )
        );
    }

    res
      .status(200)
      .json(formatoResponse('success', user, 'Usuario activado con éxito'));
  } catch (error) {
    return next(createError(500, error.message));
  }
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
      res.status(201).json(formatoResponse('succes', uid, 'Users List')).end();
    })
    .catch(err => next(createError(500, err.message)));
}

module.exports = {
  createUser,
  enableUser,
  disableUser,
  getUser,
  listFirebaseUsers,
  deleteFirebaseUser,
};
