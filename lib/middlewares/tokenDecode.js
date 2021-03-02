const formatoResponse = require('../formatoResponse');
const firebaseAdmin = require('../../firebaseAuth/adminFirebase');
const jwt = require('jsonwebtoken');
require('dotenv').config();

process.env.client_x509_cert_url;

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json(formatoResponse('Unauthorized', '', 'No hay token o invalido', 'INVALIDTOKEN'));
  }
  firebaseAdmin
    .auth()
    .verifyIdToken(req.headers.authorization)
    .then(tokenId => {
      req.user = { email: tokenId.email }
      next();
    })
    .catch(err => {
      console.log(err)
      res
      .status(401)
      .json(formatoResponse('Unauthorized', '', 'No hay token o invalido', 'INVALIDTOKEN'));
    });
};
