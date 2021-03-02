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

/* module.exports = (req, res, next) => {
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
  console.log(process.env.cert)
  
  jwt.verify(req.headers.authorization, process.env.cert, (err, decode) => {
    if (err) {
      console.log(err);
    }
    console.log(decode);
  });
  res.json({ message: 'ok'});
};
 */
/* 
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
  firebaseAdmin.auth().verifyIdToken(req.headers.authorization).then(data => {
    console.log(data)
    
  }).catch( err => {console.log(err)
  })
  res.json({ message: 'ok' });
};
 */

var {google} = require("googleapis");

// Load the service account key JSON file.
var serviceAccount = require("../../mu-proyecto-d4298-firebase-adminsdk-922pe-a8d33a27e9.json");

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

module.exports = (req, res, next) => {
  // Use the JWT client to generate an access token.
  jwtClient.authorize(function(error, tokens) {
    if (error) {
      console.log("Error making request to generate access token:", error);
    } else if (tokens.access_token === null) {
      console.log("Provided service account does not have permission to generate access tokens");
    } else {
      var accessToken = tokens.access_token;
      console.log(accessToken, 'óijnoinñokjnñoínoñkìjnòẃirnvcñiojeunbvòiqenbqeòni')
      
  
      // See the "Using the access token" section below for information
      // on how to use the access token to send authenticated requests to
      // the Realtime Database REST API.
    }
  });
  res.json({ message: 'ok' });
}
