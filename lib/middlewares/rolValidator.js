const User = require('../../models/User')
require('./lib/connectMongoose');

const getUser = async (user) => {
  
}


module.exports = function (req, res, next) {
  User.find(req.userData.mail, (err, docs) => {
    if (err) {
      res
      .status(500)
      .json(formatoResponse('error', err, 'Rol Invalid', 'INVALIDROL'));
    }
    console.log(docs)
    return next()
  })  
} 


// SiperAdmin -> todo
// Presidente -> {/president /treasurer /secretary }
//