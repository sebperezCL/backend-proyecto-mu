



module.exports = (req, res, next) => {
  if (req.userData.role === 'SuperAmin') {
    return next()
  }
  const idOrg = req.headers['X-orgId']
  req.userData = idOrg

}


