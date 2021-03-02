const formatoResponse = require('../formatoResponse');
const firebaseAdmin = require('../../firebaseAuth/adminFirebase');
const https = require('https');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const requestJwk = () => {
  https.get(process.env.client_x509_cert_url, response => {
    response.setEncoding('utf8');
    let strData = '';
    response.on('data', chunk => {
      strData += chunk;
    });
    response
      .on('end', () => {
        let parseChunk = JSON.parse(strData);
        verifyToken(parseChunk[Object.keys(parseChunk)[1]])
      })
      .on('error', err => {
        console.log('Error obtener certs google');
      });
  });
};


const verifyToken = (certs) => {
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
  const z = jwt.verify(req.headers.authorization, certs, (err, decode) => {
    if (err) {
      console.log(err);
    }
    console.log(decode);
  });
  res.json({ok: z});
};


module.exports = (req, res, next) => {
  requestJwk()
  res.end()
}

/* module.exports = async (req, res, next) => {
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
  const z = jwt.verify(req.headers.authorization, certs, (err, decode) => {
    if (err) {
      console.log(err);
    }
    console.log(decode);
  });
  res.json({ok: z});
};
 */