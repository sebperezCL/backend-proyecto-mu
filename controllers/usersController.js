'use strict';

const User = require('../models/User');
const createError = require('http-errors');
const { matchedData } = require('express-validator');

const { user } = require('../lib/connectMongoose');
const formatoResponse = require('../lib/formatoResponse');

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
      .status(200)
      .json(formatoResponse('success', user, 'Usuario creado con éxito'));
  } catch (error) {
    console.log(error, 'dentro del error')
    //return next(createError(500, error.message));
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

module.exports = {
  createUser,
  enableUser,
  disableUser,
};
