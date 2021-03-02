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
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
  next();
};
