'use strict';

const User = require('../models/User');
const formatoResponse = require('../lib/formatoResponse');



/**
 * @description Crea un nuevo usuario en la db, los datos del usuario
 * @function
 * @param Object User
 * @returns Promise
 */


function createUser(user) {
  return new Promise((reject, resolve) => {
    User.findOne(user.email)
      .then(data => {
        data ||
          resolve(
            User.create(user, (err, response) => {
              if (err) reject({ error: error });
              response
            })
          );
        const errorUserExist = new Error(`User ${data.email} already exists`);
        errorUserExist.code = 'USER_EXIST';
        reject(errorUserExist);
      })
      .catch(error => {
        reject({ error: error });
      });
  });
}

/**
 * Desactiva un usuario del sistema
 */
async function enableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'The user does NOT exist in the database.'));

    usuario.activo = true;
    await usuario.save();

    res
      .status(200)
      .json(formatoResponse('success', user, 'User successfully activated'));
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
      return next(createError(500, 'The user does NOT exist in the database'));

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
