const { validationResult } = require('express-validator');
const createError = require('http-errors');

function fieldsValidator(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorResponse = createError(
      400,
      'See details of the error in the data field'
    );
    errorResponse.alert = errors.array();
    return next(errorResponse);
  }
  next();
}

module.exports = fieldsValidator;
