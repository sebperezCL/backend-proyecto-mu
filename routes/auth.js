const express = require('express');
const router = express.Router();
const admin = require('../firebaseAuth/adminFirebase');

router.post('/registro', function (req, res, next) {
  const { email, password, name, surname } = req.body;
  admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: `${name} ${surname}`,
    })
    .then(data => {
      res.status(200).json(data.toJSON())
      console.log('Successfully updated user', data.toJSON());
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
