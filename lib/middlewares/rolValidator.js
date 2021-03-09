const User = require('../../models/User');
const formatoResponse = require('../formatoResponse');

/**
 * @description 
 * Busca en la base de datos por el email que obtiene de req.userData  
 * Compara el argumento con el listado de roles al que pertenece el usuario  
 * Añade al obj userData el rol y el idOrg  
 * nex()
 * @param {*} roles 
 * @returns 
 */
module.exports = function (roles) {
  return function (req, res, next) {
    User.findOne(req.userData.mail, (err, docs) => {
      if (err) {
        res
          .status(500)
          .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
      }
      if (docs) {
        if (!roles.includes(docs.role)) {
          return res
            .status(403)
            .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
        }
        req.userData.role = docs.role;
        req.userData.orgId = docs.organizations
        return next();
      }

      if (roles.includes('NotRegistered')) {
        req.userData.role = 'NotRegistered';
        return next();
      }

      return res
        .status(403)
        .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
    });
  };
};
