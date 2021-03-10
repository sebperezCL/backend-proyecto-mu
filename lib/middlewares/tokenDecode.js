const formatoResponse = require('../formatoResponse');
const firebaseAdmin = require('../../firebaseAuth/adminFirebase');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns if (!token) res.401
 * @returns if (token)  firebase-verify token req.userData => next
 */
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
      req.userData = {
        uid: data.uid,
        email: data.email,
      };
      next();
    })
    .catch(err => {
      res
        .status(500)
        .json(formatoResponse('error', err.message, 'TokenID error', 'ERRORTOKENID'));
    });
};
