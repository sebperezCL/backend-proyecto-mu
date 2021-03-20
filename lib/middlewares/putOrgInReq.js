const createError = require('http-errors');
const { matchedData } = require('express-validator');
const Org = require('../../models/Org');

module.exports = async (req, res, next) => {
  try {
    const data = matchedData(req);

    if (data.orgId && req.userData.role !== 'SuperAdmin') {
      //? Sólo el SuperAdmin puede obtener los usuarios de cualquier organización
      return next(createError(401, 'Forbidden'));
    }
    const orgId = data.orgId || req.headers['x-orgid'];

    if (!orgId) {
      return next(
        createError(400, 'Must indicate the orgId in header or body')
      );
    }
    const org = await Org.findById(orgId);
    req.org = org;
    return next();
  } catch (error) {
    return next(
      createError(500, 'Error creating or updating the organization')
    );
  }
};
