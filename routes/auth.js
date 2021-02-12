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
      console.log('Successfully updated user', data.toJSON());
      res.status(200).json(data.toJSON()).end()
    })
    .catch(err => {
      res.status(500).json(err.message)
      console.log(err);
    });
});


router.post('/login', function (req, res, next) {
  const { email, password } = req.body;


  admin.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    console.log(user)
    res.end()
  })
  .catch((error) => {
    res.code(500).json(error.message)
  });

});





module.exports = router;
