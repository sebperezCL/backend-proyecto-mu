const formatoResponse = require('../formatoResponse');
const firebaseAdmin = require('../../firebaseAuth/adminFirebase');
const https = require('https');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/* const requestJwk = () => {
  let cert;
  https.get(process.env.client_x509_cert_url, response => {
    response.setEncoding('utf8');
    let strData = '';
    response.on('data', chunk => {
      strData += chunk;
    });
    response
      .on('end', () => {
        let parseChunk = JSON.parse(strData);
        cert = parseChunk[Object.keys(parseChunk)[1]];
      })
      .on('error', err => {
        console.log('Error obtener certs google');
      });
  });
  return cert;
}; */

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
  console.log(req.headers.authorization);
  console.log(requestJwk());
  const certs = requestJwk();
  jwt.verify(req.headers.authorization, process.env.cert, (err, decode) => {
    if (err) {
      console.log(err);
    }
    console.log(decode);
  });
  res.json({ok: z});
};
