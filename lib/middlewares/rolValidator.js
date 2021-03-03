module.exports = function (req, res, next) {
  
/*   if (!req.user) {
    return res.json({user : 'no'})
  } */
  console.log(req.userData, '<== req.user')
  

  return next()
} 