const formatoResponse = require('../formatoResponse');
const firebaseAdmin = require('../../firebaseAuth/adminFirebase');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json(
        formatoResponse(
          'Unauthorized',
          '',
          'No hay token o invalido',
          'INVALIDTOKEN'
        )
      );
  }
  firebaseAdmin
    .auth()
    .verifyIdToken(req.headers.authorization)
    .then(data => {
      req.user = data
    })
    .catch(err => {
      res
      .status(500)
      .json(
        formatoResponse(
          'error',
          err,
          'TokenID error',
          'ERRORTOKENID'
        )
      );
    });
  next();
};