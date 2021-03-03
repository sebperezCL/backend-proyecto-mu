const User = require('../../models/User')


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