const User = require('../../models/User');
const formatoResponse = require('../formatoResponse');

/**
 * @description
 * Busca en la base de datos por el email que obtiene de req.userData
 * Compara el argumento con el listado de roles al que pertenece el usuario
 * Añade al obj userData el rol y el idOrg
 * next()
 * @param {*} roles
 * @returns
 */
module.exports = function (roles) {
  return function (req, res, next) {
    if (req.userData.role) {
      if (!roles.includes(req.userData.role)) {
        return res
          .status(403)
          .json(formatoResponse('error', {}, 'Rol Invalid', 'INVALIDROL'));
      }
      return next();
    }

    if (roles.includes('NotRegistered')) {
      req.userData.role = 'NotRegistered';
      return next();
    }
  };
};
