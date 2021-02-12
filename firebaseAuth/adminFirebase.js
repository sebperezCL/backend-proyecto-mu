const admin = require('firebase-admin')
const path = require('path')
const serviceAccount = require(path.join(__dirname, '..', 'mu-proyecto-d4298-firebase-adminsdk-922pe-a8d33a27e9.json'));

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

