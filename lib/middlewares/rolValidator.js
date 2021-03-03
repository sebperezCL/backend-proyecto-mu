module.exports = function (req, res, next) {
  console.log(req)
  
  if (!req.user) {
    return res.json({user : 'no'})
  }
  console.log(req.user, '<== req.user')
  

  return next()
} 