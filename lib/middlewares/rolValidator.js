module.exports = function (req, res, next) {
  req.prueba = 'jajajaj'
/*   if (!req.user) {
    return res.json({user : 'no'})
  } */
  console.log(req.userData, '<== req.user')
  console.log(req.prueba)
  
  

  return next()
} 