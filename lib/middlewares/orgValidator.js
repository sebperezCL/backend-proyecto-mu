const createError = require('http-errors');

module.exports = (req, res, next) => {
  if (req.userData.role === 'SuperAdmin') {
    return next();
  }
  const idOrg = req.headers['x-orgid'];
  const filterOrg = req.userData.orgs.filter(org => org._id == idOrg);
  if (filterOrg.length >= 0) return next();
  return next(createError(401, 'Forbidden'));
};
