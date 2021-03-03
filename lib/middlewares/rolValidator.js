const User = require('../../models/User')
require('./lib/connectMongoose');


const getRolByUser = (user) => {
  return new Promise
}

module.exports = async function (req, res, next) {
  const user = await User.find(user.mail).exec()
  console.log(user)
  
  return next()
} 


// SiperAdmin -> todo
// Presidente -> {/president /treasurer /secretary }
//