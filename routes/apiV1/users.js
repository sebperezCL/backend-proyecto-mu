var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const {
  createOrUpdateUser,
  enableUser,
  disableUser,
  getUser,
  listFirebaseUsers,
  deleteFirebaseUser,
} = require('../../controllers/usersController');

//! FALTA AGREGAR LOS MIDDLEWARES DE AUTENTICACION y ROLES

router.get('/', getUser);

router.post(
  '/',
  [
    body('uid', 'Indicate the user id').notEmpty(),
    body('email', "Indicate the user's email address").notEmpty(),
    body('displayName', 'Indicate the names of the user').notEmpty(),
    body('firstSurname', 'Indicate the first surname of the user').notEmpty(),
    body('secondSurname').isString(),
    body('fiscalNumber', "Indicate the user's fiscal id").notEmpty(),
    body('address').isString(),
    body('mobile').isString(),
    body('phone').isString(),
    body('photoURL'),
  ],
  fieldsValidator,
  createOrUpdateUser
);

router.put('/enable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  enableUser,
]);

router.put('/disable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  disableUser,
]);

/**
 *! Sólo para pruebas
 */
router.get('/list', listFirebaseUsers);

/**
 *! Sólo para pruebas
 */
// recoger url params uid user
// solo borrar si en mongo no hay usuario
router.delete(
  '/',
  [body('uid', 'Indicate firebase uid to delete')],
  fieldsValidator,
  deleteFirebaseUser
);

module.exports = router;
