var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

const fieldsValidator = require('../../lib/middlewares/fieldsValidators');
const userController = require('../../controllers/users.controller');

//! FALTA AGREGAR LOS MIDDLEWARES DE AUTENTICACION y ROLES

router.post(
  '/',
  [
    body('uidFirebase', 'Indicate the user id').notEmpty(),
    body('email', "Indicate the user's email address").notEmpty(),
    body('names', 'Indicate the names of the user').notEmpty(),
    body('firstSurname', 'Indicate the first surname of the user').notEmpty(),
    body('secondSurname').isString(),
    body('fiscalId', "Indicate the user's fiscal id").notEmpty(),
  ],
  fieldsValidator,
  userController.createUser
);

router.put('/enable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  userController.enableUser,
]);

router.put('/disable', [
  body('email', "Indicate the user's email address").notEmpty(),
  fieldsValidator,
  userController.disableUser,
]);

module.exports = router;
