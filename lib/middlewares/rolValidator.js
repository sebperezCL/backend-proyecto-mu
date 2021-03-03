const User = require('../../models/User');
const formatoResponse = require('../formatoResponse')


module.exports = function (roles) {
  return function (req, res, next) {
    console.log(roles);

    User.findOne(req.userData.mail, (err, docs) => {
      if (err) {
        res
          .status(500)
          .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
      }
      if (!roles.includes(docs.role)) {
        return res
          .status(403)
          .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
      }
      return next();
    });
  };
};
