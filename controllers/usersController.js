'use strict';

const User = require('../models/User');
const formatoResponse = require('../lib/formatoResponse');


/**
 * @description Funcion factoria de errores
 * @param message
 * @param code
 * @returns new Error
 * 
 */

const createError = (message, code) => {
  const error = new Error(message)
  error.code = code
  return error
}


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
        console.log(data)
        data ||
        resolve(
          User.create(user, (err, response) => {
            if (err) reject({ error: err });
            return response;
          })
        );
        reject(createError(`${user.email} already exists`, 'USER_EXIST'));
      })
      .catch(error => {
        reject({ error: error });
      });
  });
}

/**
 * Desactiva un usuario del sistema
 */
/* function enableUser(user) {
  return new Promise((reject, resolve) => {
    User.findOne({ email: user.email }).then(data => {
      if (!data) {
        const error
        reject(('The user does NOT exist in the database.'));
      }
  })


    usuario.activo = true;
    await usuario.save();

    res
      .status(200)
      .json(formatoResponse('success', user, 'User successfully activated.'));

    return next(createError(500, error.message));

} */

/**
 * Deshabilita un usuario del sistema
 */
/* async function disableUser(req, res, next) {
  try {
    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario)
      return next(createError(500, 'The user does NOT exist in the database.'));

    usuario.activo = false;
    await usuario.save();

    res
      .status(200)
      .json(formatoResponse('success', user, 'User successfully disabled.'));
  } catch (error) {
    return next(createError(500, error.message));
  }
} */

module.exports = {
  createUser,
/*   enableUser,
  disableUser, */
};
