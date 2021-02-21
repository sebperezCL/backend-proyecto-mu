var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200).json({
    message: 'Server MU is ALIVE!!',
  });
});

module.exports = router;
