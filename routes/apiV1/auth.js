const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const admin = require('../../firebaseAuth/adminFirebase');
const {
  registerAndCreateUser,
  listFirebaseUsers,
  deleteFirebaseUser,
  login,
} = require('../../controllers/authController');
const formatoResponse = require('../../lib/formatoResponse');

router.post(
  '/register',
  [
    body('email', "Indicate the user's email address").notEmpty(),
    body('password', "Indicate the user's password").notEmpty(),
    body('names', 'Indicate the names of the user').notEmpty(),
    body('firstSurname', 'Indicate the first surname of the user').notEmpty(),
    body('secondSurname').isString(),
    body('organization', 'Indicate the user organization').notEmpty(),
    body('fiscalId', "Indicate the user's fiscal id").notEmpty(),
  ],
  fieldsValidator,
  registerAndCreateUser
);

/**
 *! Sólo para pruebas
 */
router.get('/list', listFirebaseUsers);

/**
 *! Sólo para pruebas
 */
router.delete(
  '/',
  [body('uid', 'Indicate firebase uid to delete')],
  fieldsValidator,
  deleteFirebaseUser
);

router.post(
  '/login',
  [
    body('email', "Indicate the user's email address").notEmpty(),
    body('password', "Indicate the user's password").notEmpty(),
  ],
  fieldsValidator,
  login
);

module.exports = router;
