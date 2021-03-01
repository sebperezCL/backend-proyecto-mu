module.exports = function (req, res, next) {
  console.log(req.headers, 'entra en rolvalidator')
  return next()
} 