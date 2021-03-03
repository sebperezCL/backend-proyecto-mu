module.exports = function (req, res, next) {
  if (!req.user) {
    res.json({user : 'no'})
  }

  //return next()
} 