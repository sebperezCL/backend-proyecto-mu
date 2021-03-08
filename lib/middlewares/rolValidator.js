const User = require('../../models/User');
const formatoResponse = require('../formatoResponse');

// pillar el id org , rol , si root acceso a todo,
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
