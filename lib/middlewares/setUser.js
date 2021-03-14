const User = require('../../models/User');

/**
 * @description
 * Busca en la base de datos por el email que obtiene de req.userData
 * Añade al obj userData la información del usuario
 * @returns
 */
module.exports = async (req, res, next) => {
  const user = await User.findOne({ email: req.userData.email });
  if (user) {
    req.userData.orgs = user.organizations;
    req.userData.role = user.role;
  }
  next();
};
